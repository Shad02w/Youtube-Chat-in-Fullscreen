import qs from 'query-string'
import { getVideoDetails } from './get-axios'

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})



const requestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

chrome.webRequest.onCompleted.addListener(async (details: chrome.webRequest.WebResponseCacheDetails) => {
    if (!details || !details.url) return

    console.log(details)
    const url = details.url as string
    const tabId = details.tabId
    const query = qs.parseUrl(url).query


    if (!query.v) return
    const video_id = query.v as string
    const videoDetail = await getVideoDetails(video_id)
    if (videoDetail === undefined) return

    //Check whether this is a live page
    if (videoDetail.snippet?.liveBroadcastContent !== undefined &&
        videoDetail.liveStreamingDetails?.activeLiveChatId !== undefined &&
        // (videoDetail.snippet.liveBroadcastContent === 'live' || videoDetail.snippet.liveBroadcastContent === 'upcoming')) { // get live chat id 
        /**Now only support live streaming not live recorded page */
        videoDetail.snippet!.liveBroadcastContent === 'live') { // get live chat id 


        // // if it is a streaming page, inject the script
        chrome.tabs.executeScript(tabId, {
            file: 'liveChatRequestReplay.js',
        }, () => {
            const listener = (details: chrome.webRequest.WebRequestBodyDetails): void => {
                if (details.frameId === 0) return // To prevent the infinity loop, since it will capture the replayed xhr requst from content script
                chrome.tabs.sendMessage(tabId, { url: details.url })
            }

            chrome.webRequest.onBeforeRequest.addListener(listener, {
                urls: ['https://www.youtube.com/live_chat/get_live_chat*'],
                tabId,
            })
            chrome.tabs.onRemoved.addListener((id) => {
                if (id === tabId)
                    chrome.webRequest.onBeforeRequest.removeListener(listener)
            })
        })
    }

}, requestFilter)

