import qs from 'query-string'


chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})



const vidoeRequestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

const liveChatRequestFilter = {
    urls: ['https://www.youtube.com/*/get_live_chat*']

}

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
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




chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.frameId === 0) return
    console.log('/get_live_chat details', details)

    // since arraybuffer can not send through message passing, need to parse the request body first
    if (details.method === 'POST') {
        let requestBody: JSON | undefined
        if (!details.requestBody.raw) requestBody = undefined
        else {
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

}, liveChatRequestFilter, ['requestBody'])


chrome.webRequest.onCompleted.addListener((details) => {
    chrome.tabs.executeScript(details.tabId, {
        file: 'liveChatRequestReplay.js'
    })

}, vidoeRequestFilter)

