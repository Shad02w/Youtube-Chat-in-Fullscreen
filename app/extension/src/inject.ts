import browser from 'webextension-polyfill'
import { URLChangeDetector } from './util/URLChangeDetector'
import App from './Counter.svelte'

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
    const app = new App({
        target: root
    })

    console.log(app)

    URLChangeDetector.subscribe(() => {
        console.log('url changed')
    })

    console.log('youtube chat fullscreen content script injected')
}
