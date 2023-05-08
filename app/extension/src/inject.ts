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
    alert('inject')
    const root = document.createElement('div')
    // root.id = '_ycf_root'
    // document.body.appendChild(root)
    // new Counter({
    //     target: root
    // })
    //
    // alert('inject')
    //
    // const observer = new MutationObserver(() => {
    //     if (url !== window.location.href) {
    //         url = window.location.href
    //         console.log('url changed')
    //     }
    // })
    //
    // observer.observe(document.body, { childList: true, subtree: true })
}
