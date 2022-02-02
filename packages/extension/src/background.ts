import { content } from '@ycf/shared/src/content'

// const getLiveChatRequestFilter: chrome.webRequest.RequestFilter = {
//     urls: ['https://www.youtube.com/*/get_live_chat?*', 'https://www.youtube.com/*/get_live_chat_replay?*']
// }

const LiveChatRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/live_chat*', 'https://www.youtube.com/live_chat_replay*']
}

chrome.webRequest.onCompleted.addListener(detail => {
    console.log(`content: ${content}`, detail.tabId, detail.url)
}, LiveChatRequestFilter)
