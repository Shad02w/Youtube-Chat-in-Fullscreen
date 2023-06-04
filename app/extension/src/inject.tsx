/* @refresh reload */
import { render } from 'solid-js/web'
import browser from 'webextension-polyfill'
import { Overlay } from './Overlay'
import { URLChangeDetector } from './util/URLChangeDetector'
import { ROOT_ID } from './util/constant'

interface LiveChatPageInfo {
    type: 'live-chat' | 'live-chat-replay'
    url: string
}

declare const window: Window & { _ycf_initialized: boolean }

class ChatApp {
    private pageInfo: LiveChatPageInfo | null = null
    private _dispose: (() => void) | null = null

    constructor() {
        browser.runtime.onMessage.addListener((message) => {
            if (message.type === 'live-chat-url') {
                this.pageInfo = { type: 'live-chat', url: message.url }
            }
        })

        URLChangeDetector.subscribe(() => (this.pageInfo = null))

        document.addEventListener('fullscreenchange', () => {
            document.fullscreenElement ? this.render() : this.dispose()
        })
    }

    private render() {
        if (!this.pageInfo || this._dispose) return

        const root = document.createElement('div')
        root.id = ROOT_ID
        document.body.appendChild(root)

        switch (this.pageInfo.type) {
            case 'live-chat':
                this._dispose = render(() => <Overlay liveChatUrl={this.pageInfo!.url} />, root)
                break
            case 'live-chat-replay':
                this._dispose = render(() => <Overlay liveChatUrl={this.pageInfo!.url} />, root)
                break
        }
    }

    private dispose() {
        this._dispose?.()
        document.getElementById(ROOT_ID)?.remove()
        this._dispose = null
    }
}

function initialize() {
    new ChatApp()
    console.log('youtube chat fullscreen content script injected')
}

if (!window._ycf_initialized) {
    window._ycf_initialized = true
    initialize()
}
