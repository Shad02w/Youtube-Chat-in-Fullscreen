import browser from 'webextension-polyfill'
import Counter from './Counter.svelte'

declare const window: Window & { _ycf_initialized: boolean }
if (!window._ycf_initialized) {
    window._ycf_initialized = true
    browser.runtime.onMessage.addListener((message) => console.log(message))
    initialize()
}

let url = window.location.href

function initialize() {
    const root = document.createElement('div')
    root.id = '_ycf_root'
    document.body.appendChild(root)
    console.log(Counter)

    const observer = new MutationObserver(() => {
        if (url !== window.location.href) {
            url = window.location.href
            console.log('url changed')
        }
    })

    alert('inject')
    observer.observe(document.body, { childList: true, subtree: true })
}
