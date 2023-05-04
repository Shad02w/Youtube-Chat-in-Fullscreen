import browser from 'webextension-polyfill'

declare const window: Window & { __ycf_initialized: boolean }
if (!window.__ycf_initialized) {
    initialize()
}

//
function initialize() {
    window.__ycf_initialized = true

    alert('youtube live chat replay extension injected')

    browser.runtime.onMessage.addListener((message) => {
        console.log(message)
    })

    browser.runtime.onMessage.addListener((message) => {
        console.log(message)
    })
}
