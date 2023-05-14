/* @refresh reload */
import { render } from 'solid-js/web'
import browser from 'webextension-polyfill'
import { App } from './App'
import { URLChangeDetector } from './util/URLChangeDetector'

const ROOT_ID = '_ycf_root'

export class ChatApp {
    private dispose: (() => void) | null = null
    constructor() {
        browser.runtime.onMessage.addListener((message) => {
            if (message.type === 'live-chat-url') {
                this.start(message.url)
            }
        })

        URLChangeDetector.subscribe(() => this.stop())
    }

    private start(liveChatUrl: string) {
        if (this.dispose) return

        const root = document.createElement('div')
        root.id = ROOT_ID
        document.body.appendChild(root)
        this.dispose = render(() => <App liveChatUrl={liveChatUrl} />, root)
    }

    private stop() {
        this.dispose?.()
        document.getElementById(ROOT_ID)?.remove()
    }
}
