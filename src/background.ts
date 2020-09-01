import parse from 'url-parse'
import chromep from 'chrome-promise'


interface Position {
    x: number,
    y: number
}

interface Size {
    width: number,
    height: number
}

export interface StorageItems {
    on: boolean,
    position: Position
    size: Size
}

type RequestType = 'live-chat' | 'replay-live-chat' | 'video-page'

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    type: RequestType
    // greeting?: 'hi'
}

export const preset: StorageItems = {
    on: true,
    position: {
        x: 50,
        y: 50
    },
    size: {
        width: 400,
        height: 400
    }
}

const getLiveChatRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/*/get_live_chat?*', 'https://www.youtube.com/*/get_live_chat_replay?*']
}

const watchPageRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/watch*']
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
    console.log(parse(details.url).pathname, 'tab id:', details.tabId, details)
    chrome.tabs.executeScript(details.tabId, {
        file: 'inject.js',
        runAt: 'document_idle'
    }, () => {
        const message: CatchedLiveChatRequestMessage = {
            details,
            type: 'video-page'
        }
        chrome.tabs.sendMessage(details.tabId, message)
    })
}
function getLiveChatRequestListener(details: chrome.webRequest.WebRequestBodyDetails) {

    console.log(parse(details.url).pathname, 'tab id:', details.tabId, details)
    // The replay request will sent from frame id 0, block the replayed requset from content script to prevent looping
    if (details.frameId === 0) return
    if (details.method === 'POST') {
        let requestBody: JSON | undefined
        if (!details.requestBody.raw) requestBody = undefined
        else {
            // Since arraybuffer can not send through message passing, need to parse the request body first
            requestBody = RequestBodyArrayBuffer2json(details.requestBody.raw)
        }
        const message: CatchedLiveChatRequestMessage = {
            details,
            requestBody,
            type: 'live-chat'
        }
        chrome.tabs.sendMessage(details.tabId, message)
    } else {
        const message: CatchedLiveChatRequestMessage = {
            details,
            type: 'live-chat'
        }
        chrome.tabs.sendMessage(details.tabId, message)
    }
}

function attachListeners() {
    if (!chrome.webRequest.onCompleted.hasListener(watchPageRequestListener))
        chrome.webRequest.onCompleted.addListener(watchPageRequestListener, watchPageRequestFilter)
    if (!chrome.webRequest.onBeforeRequest.hasListener(getLiveChatRequestListener))
        chrome.webRequest.onBeforeRequest.addListener(getLiveChatRequestListener, getLiveChatRequestFilter, ['requestBody'])
}

function removeListeners() {
    if (chrome.webRequest.onCompleted.hasListener(watchPageRequestListener))
        chrome.webRequest.onCompleted.removeListener(watchPageRequestListener)
    if (chrome.webRequest.onBeforeRequest.hasListener(getLiveChatRequestListener))
        chrome.webRequest.onBeforeRequest.removeListener(getLiveChatRequestListener)

}

//Run when extension just installed and reloaded
chrome.runtime.onInstalled.addListener(async () => {
    const data = await chromep.storage.sync.get(['on'])
    if (data.on === undefined) {
        chromep.storage.sync.set(preset)
    }

    // create the necessary variable in storage
    chrome.storage.sync.set({
        on: true
    }, () => console.log('storage created'))
})


// Get the variable 'on' in storage to check whether the extension is on or not
chrome.storage.sync.get(['on'], (result) => {
    if (result.on) attachListeners()
})



chrome.storage.onChanged.addListener((changes) => {
    // Turn on/off extension core
    // console.log('on changes:', changes)
    if (changes['on']) {
        const isOn = changes['on'].newValue as boolean
        if (isOn) attachListeners()
        else removeListeners()
    }
})







