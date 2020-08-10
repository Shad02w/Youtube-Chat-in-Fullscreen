import axios from 'axios'
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

    chrome.runtime.onMessage.addListener(async (message: CatchedLiveChatRequestMessage) => {
        console.log(message)
        const res = await axios.get(message.url)
        const data = res.data as YoutubeLiveChat.Data

        if (data.response.continuationContents.liveChatContinuation.actions &&
            data.response.continuationContents.liveChatContinuation.actions.length === 0) return
        const { response: { continuationContents: { liveChatContinuation: { actions } } } } = data
        console.log(actions)
    })



})()

