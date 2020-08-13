import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { CatchedLiveChatRequestMessage } from './background'
import './css/App.css'

/* Replay the get_live_chat xhr request to get the response */


interface MyWindow extends Window {
    injectHasRun: boolean
    requestIdleCallback(callback: any, options?: any): number
    cancelIdleCallback(handle: number): void
}


declare var window: MyWindow



(function () {

    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab
    if (window.injectHasRun === true)
        return
    window.injectHasRun = true

    // run code here
    console.log('liveChatRequestReplay.js injected')
    const chatListContainerId = '_chat-list-container'


    // The request either be get or post
    async function ReplayRequest(url: string, requestBody?: JSON): Promise<YoutubeLiveChat.Data | undefined> {
        let data: YoutubeLiveChat.Data | undefined
        try {
            if (!requestBody) {
                const res = await axios.get(url)
                data = res.data as YoutubeLiveChat.Data
                console.log('GET', data)
            } else {
                const res = await axios.post(url, requestBody, { responseType: 'json' })
                data = res.data as YoutubeLiveChat.Data
                console.log('POST', data)
            }
        } catch (error) {
            if (error.response)
                console.error(error.response.data)
            else
                console.error(error)
        }
        return data
    }

    const App: React.FC = () => {

        const [chatList, setChatList] = useState<YoutubeLiveChat.LiveChatContinuationAction[]>([])


        useEffect(() => {
            chrome.runtime.onMessage.addListener(async function (message: CatchedLiveChatRequestMessage) {
                console.log(message)
                const { url } = message.details
                const requestBody = message.requestBody
                const data = await ReplayRequest(url, requestBody)
                // if (!data || !data.response.continuationContents.liveChatContinuation.actions) return
            })
        }, [])

        const creteChatList = () => {
            if (chatList.length === 0)
                return <></>
            else
                return <p>AAAAAAAAAAAA</p>
        }


        return (
            <div id='chat-list-inner-container'>
                {creteChatList()}
            </div>
        )
    }


    // Check constantly whether player-container is already created
    let cancel_id = window.requestIdleCallback(createChatListContainer)

    function createChatListContainer() {
        const playerContainer = document.getElementById('player-container')
        if (!playerContainer) {
            cancel_id = window.requestIdleCallback(createChatListContainer)
        } else {
            console.log('have container')
            window.cancelIdleCallback(cancel_id)
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)
            render(<App />, document.getElementById(chatListContainerId))
        }
    }



    // function createChatListContainer() {
    //     const playerContainer = document.getElementById('player-container')
    //     if (!playerContainer) return
    //     console.log('have container')
    //     const chatListContainer = document.createElement('div')
    //     chatListContainer.id = chatListContainerId
    //     playerContainer.append(chatListContainer)
    //     render(<App />, document.getElementById(chatListContainerId))
    // }
    // createChatListContainer()






})()

