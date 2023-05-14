import { ChatApp } from './ChatApp'

declare const window: Window & { _ycf_initialized: boolean }
if (!window._ycf_initialized) {
    window._ycf_initialized = true

    initialize()
}

function initialize() {
    new ChatApp()
    console.log('youtube chat fullscreen content script injected')
}
