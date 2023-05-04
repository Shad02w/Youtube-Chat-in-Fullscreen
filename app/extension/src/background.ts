import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
    console.log('just installed')
    // initialize setting
})

browser.tabs.onUpdated.addListener((tabId) => {
    browser.tabs.sendMessage(tabId, { type: 'tab-update', tabId })
})
