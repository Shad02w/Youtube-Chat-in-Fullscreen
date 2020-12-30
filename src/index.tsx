import React from 'react'
import { render } from 'react-dom'
import { CatchedLiveChatRequestMessage } from './models/Request'
import { ContentScriptWindow } from './models/Window'
import { Messages } from './models/Event';

declare var window: ContentScriptWindow
const setGlobalVariables = () => {
    window.injectHasRun = true
    window.ready = false
    window.messages = new Messages([])
}

(async function () {

    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab

    const chatListContainerId = '_youtube-chat-in-fullscreen-app'

    if (window.injectHasRun) return

    setGlobalVariables()

    // cache message first
    chrome.runtime.onMessage.addListener((message: CatchedLiveChatRequestMessage) => {
        if (message.type === 'normal' || window.ready) return
        window.messages.add(message)
    })

    const { App } = await import(/* webpackMode: "eager" */'./App')

    console.log('liveChatRequestReplay.js injected')

    const observer = new MutationObserver(() => {
        const chatOverlayContainer = Array
            .from(document.querySelectorAll('#player-container'))
            .find(el => el.className.includes('ytd-watch-flexy'))

        if (chatOverlayContainer) {
            observer.disconnect()
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            chatOverlayContainer.append(chatListContainer)

            const script = document.createElement('script')
            script.src = chrome.runtime.getURL('./pageInject.js')
            document.body.append(script)

            script.addEventListener('load', () => {
                render(
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>,
                    document.getElementById(chatListContainerId))
            })
        }

    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })

})()
