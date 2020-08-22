import React, { StrictMode } from 'react'
import { render } from 'react-dom'



interface MyWindow extends Window {
    injectHasRun: boolean
    requestIdleCallback(callback: any, options?: any): number
    cancelIdleCallback(handle: number): void
}
declare var window: MyWindow




(async function () {


    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab

    if (window.injectHasRun === true)
        return
    window.injectHasRun = true

    // Dynamic import '@material-ui' to solve the issue of initilize multiple instance
    const { App } = await import('./App')


    // run code here
    const chatListContainerId = '_youtube-chat-in-fullscreen-app'
    console.log('liveChatRequestReplay.js injected')

    requestAnimationFrame(createChatListContainer)

    function createChatListContainer() {
        const playerContainer = document.getElementById('player-container')
        if (!playerContainer) {
            requestAnimationFrame(createChatListContainer)
        } else {
            console.log('have container')
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)
            render(
                <StrictMode>
                    <App />
                </StrictMode>
                , document.getElementById(chatListContainerId))
        }
    }

})()
