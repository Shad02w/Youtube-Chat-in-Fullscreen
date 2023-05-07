import browser from 'webextension-polyfill'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

declare const window: Window & { _ycf_initialized: boolean }
if (!window._ycf_initialized) {
    window._ycf_initialized = true
    initialize()
}

let url = window.location.href

function initialize() {
    const root = document.createElement('div')
    root.id = '_ycf_root'
    document.body.appendChild(root)
    createRoot(root).render(<App />)

    const observer = new MutationObserver((callback) => {
        if (url !== window.location.href) {
            url = window.location.href
            console.log('url changed')
        }
    })

    alert('inject')
    observer.observe(document.body, { childList: true, subtree: true })
}
