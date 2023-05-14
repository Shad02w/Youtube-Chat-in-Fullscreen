import browser from 'webextension-polyfill'
import { URL_MARKER } from './util/constant'

browser.runtime.onInstalled.addListener(() => {
    console.log('just installed')
    // initialize setting
})

browser.webRequest.onCompleted.addListener(
    async ({ tabId, url }) => {
        if (url.includes(URL_MARKER)) return
        browser.tabs.sendMessage(tabId, { type: 'live-chat-url', url })
    },
    { urls: ['https://www.youtube.com/live_chat*'] }
)
