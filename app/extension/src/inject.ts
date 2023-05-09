import browser from 'webextension-polyfill'
import App from './App.svelte'

declare const window: Window & { _ycf_initialized: boolean }
if (!window._ycf_initialized) {
    window._ycf_initialized = true
    browser.runtime.onMessage.addListener((message) => console.log(message))
    initialize()
}

function initialize() {
    const root = document.createElement('div')
    root.id = '_ycf_root'
    document.body.appendChild(root)
    new App({
        target: root
    })

    console.log('youtube chat fullscreen content script injected')
}
