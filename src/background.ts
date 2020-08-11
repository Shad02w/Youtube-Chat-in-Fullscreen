import qs from 'query-string'


chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})



const vidoeRequestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

const liveChatRequestFilter = {
    // urls: ['https://www.youtube.com/live_chat/get_live_chat*']
    // urls: ['https://www.youtube.com/youtubei/v1/live_chat/get_live_chat*']
    urls: ['https://www.youtube.com/*/get_live_chat*']

}

export interface CatchedLiveChatRequestMessage {
    tabId: number
    url: string
}

chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.frameId === 0) return
    console.log('/get_live_chat details', details)
    const message: CatchedLiveChatRequestMessage = {
        tabId: details.tabId,
        url: details.url
    }
    chrome.tabs.sendMessage(details.tabId, message)
}, liveChatRequestFilter, ['requestBody'])


chrome.webRequest.onCompleted.addListener((details) => {
    chrome.tabs.executeScript(details.tabId, {
        file: 'liveChatRequestReplay.js'
    })

}, vidoeRequestFilter)

// Cant catch url request when user refresh the page, which need to inject content script again
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//     console.log(details)
//     // send a message to the tab to check whether the content scripted has been injected
//     chrome.tabs.executeScript(details.tabId, {
//         file: 'liveChatRequestReplay.js'
//     })
// },
//     {
//         url: [
//             {
//                 urlContains: 'https://www.youtube.com/watch'
//             }
//         ]
//     }
// )
