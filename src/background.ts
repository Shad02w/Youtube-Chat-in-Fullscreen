import parse from 'url-parse'
chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})




const requestFilter = {
    urls: ['https://www.youtube.com/*/get_live_chat?*', 'https://www.youtube.com/*/get_live_chat_replay?*']

}

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    greeting?: 'hi'
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

let t1: number = 0
let t2: number = 0

chrome.webRequest.onCompleted.addListener(details => {
    chrome.tabs.executeScript(details.tabId, {
        file: 'liveChatRequestReplay.js',
        runAt: 'document_idle'
    }, () => {
        const message: CatchedLiveChatRequestMessage = {
            details,
            greeting: 'hi'
        }
        chrome.tabs.sendMessage(details.tabId, message)
    })
}, { urls: ['https://www.youtube.com/watch*'] })


chrome.webRequest.onBeforeRequest.addListener((details) => {
    console.log(parse(details.url).pathname, details.tabId, details)
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
            requestBody
        }
        chrome.tabs.sendMessage(details.tabId, message)
    } else {
        const message: CatchedLiveChatRequestMessage = {
            details
        }
        chrome.tabs.sendMessage(details.tabId, message)
    }
}, requestFilter, ['requestBody'])




