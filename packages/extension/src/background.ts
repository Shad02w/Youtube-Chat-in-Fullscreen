import { initialPreference } from './model/storage'
// const getLiveChatRequestFilter: chrome.webRequest.RequestFilter = {
//     urls: ['https://www.youtube.com/*/get_live_chat?*', 'https://www.youtube.com/*/get_live_chat_replay?*']
// }
//
//

const LiveChatRequestFilter: chrome.webRequest.RequestFilter = {
    urls: ['https://www.youtube.com/live_chat*', 'https://www.youtube.com/live_chat_replay*']
}

const injectContentScript = (details: chrome.webRequest.WebResponseCacheDetails) => {
    chrome.scripting.executeScript({
        target: {
            tabId: details.tabId
        },
        files: ['./content-script.js']
    })
}

const initializeStorage = () => chrome.storage.local.set(initialPreference)

const addListener = () => {
    if (!chrome.webRequest.onCompleted.hasListener(injectContentScript)) {
        chrome.webRequest.onCompleted.addListener(injectContentScript, LiveChatRequestFilter)
    }
}

const removeListener = () => chrome.webRequest.onCompleted.removeListener(injectContentScript)

chrome.runtime.onInstalled.addListener(initializeStorage)

chrome.storage.local.get(['enable'], data => {
    if (data.enable === true) {
        addListener()
    }
})

chrome.storage.onChanged.addListener(changed => {
    if ('enable' in changed) {
        if (changed.enable.newValue) {
            addListener()
        } else {
            removeListener()
        }
    }
})
