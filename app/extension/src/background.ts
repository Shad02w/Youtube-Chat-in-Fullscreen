import browser from 'webextension-polyfill'
import { URL_MARKER } from './util/constant'

browser.runtime.onInstalled.addListener(() => {
    console.log('just installed')
    // initialize setting
})

// use webNavigation instead of webRequest, since in firefox, tabId is always -1 in webRequest
browser.webNavigation.onCommitted.addListener(
    ({ url, tabId }) => {
        if (url.includes(URL_MARKER)) return
        browser.tabs.sendMessage(tabId, { type: 'live-chat-url', url })
    },
    { url: [{ urlPrefix: 'https://www.youtube.com/live_chat' }] }
)
