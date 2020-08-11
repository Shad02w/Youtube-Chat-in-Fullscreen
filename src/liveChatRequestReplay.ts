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





    chrome.runtime.onMessage.addListener(async function (message: CatchedLiveChatRequestMessage) {
        console.log(message)
        const { url } = message.details
        const requestBody = message.requestBody
        const data = await ReplayRequest(url, requestBody)
        if (data === undefined) return

    })



})()

