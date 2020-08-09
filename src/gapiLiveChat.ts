import qs from 'query-string'
import { getVideoDetails, getLiveMessages } from './get-axios'


const AppendLiveChatList = async (list: gapi.client.youtube.LiveChatMessage[]) => {
    if (!list || list.length === 0) return
}



(async function () {
    console.log('js injected')
    /**This method may reach the max quota of Youtube Data Api request */

    const query = qs.parseUrl(window.location.href).query
    if (query.v === undefined) return
    const video_id = query.v as string
    console.log(video_id)
    const video = await getVideoDetails(video_id)
    console.log('video', video)

    if (!video || !video?.liveStreamingDetails?.activeLiveChatId) return



    let nextPageToken: string = ''
    let pollingInterval = 0
    const liveChatId = video.liveStreamingDetails.activeLiveChatId

    const runRequestByPollingInterval = async () => {
        const chat = await getLiveMessages(
            liveChatId,
            nextPageToken.length > 0 ? nextPageToken : undefined
        )
        console.log('live chat', chat)
        if (chat?.nextPageToken)
            nextPageToken = chat.nextPageToken
        if (chat?.pollingIntervalMillis)
            pollingInterval = chat.pollingIntervalMillis

        // After getting the chat list, show all the chat before next live chat request


        setTimeout(runRequestByPollingInterval, pollingInterval)

    }



    setTimeout(runRequestByPollingInterval, pollingInterval)



})()






// going to use google stream api directly



/** Changing XMLHttpRequest prototype can not catch all xhr request, dont not why */
// const script = document.createElement('script')
// script.src = chrome.runtime.getURL('xhrMod.js');
// document.head.appendChild(script)













