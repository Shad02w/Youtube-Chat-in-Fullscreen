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
}


chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.frameId === 0) return
    console.log('/get_live_chat details', details)


    const message: CatchedLiveChatRequestMessage = {
        details
    }
    chrome.tabs.sendMessage(details.tabId, message)
}, liveChatRequestFilter, ['requestBody'])


chrome.webRequest.onCompleted.addListener((details) => {
    chrome.tabs.executeScript(details.tabId, {
        file: 'liveChatRequestReplay.js'
    })

}, vidoeRequestFilter)

