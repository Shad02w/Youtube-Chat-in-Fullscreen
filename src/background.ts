import parse from 'url-parse'
import chromep from 'chrome-promise'
import { StoragePreset, StorageItems } from './models/Storage'
import { CatchedLiveChatRequestMessage, PageType } from './models/Request'

type MessagesStore = CatchedLiveChatRequestMessage[]

const createMessageMap = () => {
    let messageStore: MessagesStore = []
    const add = (requestId: string, message: CatchedLiveChatRequestMessage) => {
        if (messageStore.some(m => m.details.requestId === requestId)) return
        messageStore.push(message)

    }
    const get = (requestId: string) => {
        const results = messageStore.filter(m => m.details.requestId === requestId)
        return results[0]
    }

    const clear = () => messageStore = []
    const hasRequestId = (requestId: string) => Object.keys(messageStore).some(id => id === requestId)

    return { store: messageStore, add, get, clear, hasRequestId }
}

const messageStore = createMessageMap()


const getLiveChatRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/*/get_live_chat?*', 'https://www.youtube.com/*/get_live_chat_replay?*']
}

const watchPageRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

const watchPageNavigationFilter: chrome.webNavigation.WebNavigationEventFilter = {
    url: [
        {
            hostSuffix: 'youtube.com',
            pathContains: 'watch'
        }
    ]
}


// reference to https://gist.github.com/72lions/4528834
export function RequestBodyArrayBuffer2json(raw: chrome.webRequest.UploadData[]): JSON {
    // combine the raw data array
    const byteLengthArray = raw.map(buffer => buffer.bytes!.byteLength)
    const totalByteLength = byteLengthArray.reduce((pre, curr) => pre + curr)
    const view = new Uint8Array(totalByteLength)

    byteLengthArray.reduce((pre, curr, currIndex) => {
        view.set(new Uint8Array(raw[currIndex].bytes!), pre)
        return curr
    }, 0)
    const jsonString = decodeURIComponent(String.fromCharCode.apply(null, Array.from(view)))
    return JSON.parse(jsonString)
}


function watchPageRequestListener(details: chrome.webRequest.WebResponseCacheDetails) {
    // console.log(parse(details.url).pathname, 'tab id:', details.tabId, details)
    chrome.tabs.executeScript(details.tabId, {
        file: 'inject.js',
        runAt: 'document_idle'
    }, () => {
        const message: CatchedLiveChatRequestMessage = {
            details,
            type: 'normal'
        }
        chrome.tabs.sendMessage(details.tabId, message)
    })
}

const getChatType = (url: string): PageType => {
    if (parse(url).pathname.endsWith('get_live_chat')) return 'live-chat'
    return 'replay-live-chat'
}


function getLiveChatRequestBodyListener(details: chrome.webRequest.WebRequestBodyDetails) {

    // The replay request will sent from frame id 0, block the replayed request from content script to prevent looping
    if (details.frameId === 0) return
    let requestBody: JSON | undefined
    if (!details.requestBody.raw) requestBody = undefined
    else
        // Since arraybuffer can not send through message passing, need to parse the request body first
        requestBody = RequestBodyArrayBuffer2json(details.requestBody.raw)

    messageStore.add(
        details.requestId,
        {
            details,
            requestBody,
            type: getChatType(details.url)
        }
    )
}

function getLiveChatRequestHeadersListener(details: chrome.webRequest.WebRequestHeadersDetails) {
    if (details.frameId === 0) return
    const message = messageStore.get(details.requestId)
    if (message)
        message.requestHeaders = details.requestHeaders

    chrome.tabs.sendMessage(details.tabId, message)
}

function pageHistoryChangeListener(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
    // console.log('onHistory change', details)
    const message: CatchedLiveChatRequestMessage = {
        details: {} as chrome.webRequest.WebRequestDetails,
        type: 'normal'
    }
    chrome.tabs.sendMessage(details.tabId, message)
}



function attachListeners() {
    if (!chrome.webRequest.onCompleted.hasListener(watchPageRequestListener))
        chrome.webRequest.onCompleted.addListener(watchPageRequestListener, watchPageRequestFilter)

    if (!chrome.webRequest.onBeforeRequest.hasListener(getLiveChatRequestBodyListener))
        chrome.webRequest.onBeforeRequest.addListener(getLiveChatRequestBodyListener, getLiveChatRequestFilter, ['requestBody'])

    if (!chrome.webRequest.onBeforeSendHeaders.hasListener(getLiveChatRequestHeadersListener))
        chrome.webRequest.onBeforeSendHeaders.addListener(getLiveChatRequestHeadersListener, getLiveChatRequestFilter, ['requestHeaders'])

    if (!chrome.webNavigation.onHistoryStateUpdated.hasListener(pageHistoryChangeListener))
        chrome.webNavigation.onHistoryStateUpdated.addListener(pageHistoryChangeListener, watchPageNavigationFilter)
}

function removeListeners() {
    if (chrome.webRequest.onCompleted.hasListener(watchPageRequestListener))
        chrome.webRequest.onCompleted.removeListener(watchPageRequestListener)

    if (chrome.webRequest.onBeforeRequest.hasListener(getLiveChatRequestBodyListener))
        chrome.webRequest.onBeforeRequest.removeListener(getLiveChatRequestBodyListener)

    if (chrome.webRequest.onBeforeSendHeaders.hasListener(getLiveChatRequestHeadersListener))
        chrome.webRequest.onBeforeSendHeaders.removeListener(getLiveChatRequestHeadersListener)

    if (chrome.webNavigation.onHistoryStateUpdated.hasListener(pageHistoryChangeListener))
        chrome.webNavigation.onHistoryStateUpdated.removeListener(pageHistoryChangeListener)

}

//Run when extension just installed and reloaded
chrome.runtime.onInstalled.addListener(async () => {
    const storage = await chromep.storage.local.get(null) as Partial<StorageItems>
    if (storage.on === undefined) {
        await chromep.storage.local.set(StoragePreset)
        console.log('fresh install')
    } else {
        console.log('updated');
    }
})


// Get the variable 'on' in storage to check whether the extension is on or not
chrome.storage.local.get(['on'], (result) => {
    if (result.on) attachListeners()
})



chrome.storage.onChanged.addListener((changes) => {
    //Remove all Web Request listener on background script
    if (changes['on']) {
        const isOn = changes['on'].newValue as boolean
        if (isOn) attachListeners()
        else removeListeners()
    }
})







