import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { StorageContextProvider } from './components/StorageContext'



interface MyWindow extends Window {
    injectHasRun: boolean
    requestIdleCallback(callback: any, options?: any): number
    cancelIdleCallback(handle: number): void
}
declare var window: MyWindow




(async function () {


    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab
    const chatListContainerId = '_youtube-chat-in-fullscreen-app'

    if (document.getElementById(chatListContainerId))
        return

    // Dynamic import '@material-ui' to solve the issue of initilize multiple instance
    const { App } = await import('./App')


    // run code here
    console.log('liveChatRequestReplay.js injected')

    // setTimeout(createChatListContainer, 0)
    requestAnimationFrame(createChatListContainer)

    function createChatListContainer() {
        const playerContainer = document.getElementById('player-container')
        if (!playerContainer) {
            // setTimeout(createChatListContainer, 0)
            requestAnimationFrame(createChatListContainer)
        } else {
            console.log('have container')
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)
            render(
                <React.StrictMode>
                    <StorageContextProvider>
                        <App />
                    </StorageContextProvider>
                </React.StrictMode>
                , document.getElementById(chatListContainerId))
        }
    }

})()
