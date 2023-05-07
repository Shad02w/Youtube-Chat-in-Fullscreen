import browser from 'webextension-polyfill'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

declare const window: Window & { _ycf_initialized: boolean }
if (!window._ycf_initialized) {
    window._ycf_initialized = true
    initialize()
}

function initialize() {
    browser.runtime.onMessage.addListener((message) => {
        console.log(message)
    })

    const root = document.createElement('div')
    root.id = '_ycf_root'
    const youtubeApp = document.querySelector('ytd-app')
    if (youtubeApp) {
        youtubeApp.parentNode?.insertBefore(root, youtubeApp)
        createRoot(root).render(<App />)
    }
}
