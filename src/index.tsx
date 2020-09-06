import React from 'react'
import { render } from 'react-dom'
import { StorageContextProvider } from './components/StorageContext'
import { ChatContextProvider } from './components/ChatContext'
import { ChatQueueProvider } from './components/ChatQueue'
import { PageContextProvider } from './components/PageContext'




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

    console.log('liveChatRequestReplay.js injected')

    const observer = new MutationObserver(() => {
        const playerContainer = document.getElementById('player-container')
        if (playerContainer) {
            console.log('have play container')
            observer.disconnect()
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)

            const script = document.createElement('script')
            script.src = chrome.runtime.getURL('./pageInject.js')
            document.body.append(script)


            render(
                <React.StrictMode>
                    <StorageContextProvider>
                        <PageContextProvider>
                            <ChatQueueProvider>
                                <ChatContextProvider>
                                    <App />
                                </ChatContextProvider>
                            </ChatQueueProvider>
                        </PageContextProvider>
                    </StorageContextProvider>
                </React.StrictMode>,
                document.getElementById(chatListContainerId))
        }


    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })

})()
