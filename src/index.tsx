import React from 'react'
import { render } from 'react-dom'

(async function () {


    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab

    const chatListContainerId = '_youtube-chat-in-fullscreen-app'

    if (document.getElementById(chatListContainerId))
        return

    // Dynamic import '@material-ui' to solve the issue of initilize multiple instance
    // const AppSrc = chrome.runtime.getURL('App.js')

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

            render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>,
                document.getElementById(chatListContainerId))
        }


    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })

})()
