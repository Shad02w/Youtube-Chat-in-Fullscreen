import axios, { AxiosResponse } from 'axios'
import { CatchedLiveChatRequestMessage } from './background'

/* Replay the get_live_chat xhr request to get the response */


interface MyWindow extends Window {
    injectHasRun: boolean
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

    // id
    const addChatListToDOM = async (chatListActions: YoutubeLiveChat.LiveChatContinuationAction[]) => {
        const videoContainer = document.getElementById('container')
        console.log(videoContainer)
        const overlayLiveChatContainer = document.createElement('div')
        overlayLiveChatContainer.id = 'overlay-live-chat-container'
        // overlayLiveChatContainer.style.width = '100px'
        // overlayLiveChatContainer.style.height = '200px'
        // overlayLiveChatContainer.style.background = 'black'
        // overlayLiveChatContainer.style.color = '#fff'
        chatListActions.map(action => {
            const p = document.createElement('p')
            p.innerHTML = action.addChatItemAction.item.liveChatTextMessageRenderer.message.runs[0].text
        })

    }


    chrome.runtime.onMessage.addListener(async (message: CatchedLiveChatRequestMessage) => {
        console.log(message)
        // let res: AxiosResponse<YoutubeLiveChat.Data> | undefined = undefined
        // try {
        //     res = await axios.post(message.url)
        // } catch (error) {
        //     error.response.data
        // }
        // if (res === undefined) return
        // // const data = res.data as YoutubeLiveChat.Data
        // console.log('data', data)

        // if (data.response.continuationContents.liveChatContinuation.actions &&
        //     data.response.continuationContents.liveChatContinuation.actions.length === 0) return
        // const { response: { continuationContents: { liveChatContinuation: { actions } } } } = data

    })



})()

