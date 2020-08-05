/// <reference types="@types/gapi.client" />

import URL from 'url'
import qs from 'querystring'
import { getVideoDetails } from './get'



chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})


const requestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

chrome.webRequest.onCompleted.addListener(async (details: any) => {
    if (!details || !details.url) return

    console.log(details)
    const url = details.url as string
    const tabId = details.tabId
    const query = qs.decode(URL.parse(url).query as string)
    console.log(query)


    if (!query.v) return
    const video_id = query.v as string
    const videoDetail = await getVideoDetails(video_id)
    console.log(videoDetail)

    if (videoDetail.snippet.liveBroadcastContent !== undefined &&
        // (videoDetail.snippet.liveBroadcastContent === 'live' || videoDetail.snippet.liveBroadcastContent === 'upcoming')) { // get live chat id 
        /**Now only support live streaming not live recorded page */
        videoDetail.snippet.liveBroadcastContent === 'live') { // get live chat id 

        // if it is a streaming page, inject the script
        chrome.tabs.executeScript(tabId, {
            file: 'inject.js'
        }, () => {
            console.log('js injected')
        })
    }

}, requestFilter)

