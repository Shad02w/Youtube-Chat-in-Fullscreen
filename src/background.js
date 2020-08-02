const URL = require('url')
const qs = require('querystring')

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
})

const requestFilter = {
    urls: ['https://www.youtube.com/watch*']
}

chrome.webRequest.onCompleted.addListener((details) => {
    if (!details || !details.url) return

    console.log(details)
    const url = details.url
    const result = URL.parse(url)
    const query = qs.decode(result.query)

    if (!query.v) return
    const watch_id = query.v

    // get the watch_id, to check whether it is a live streaming page


}, requestFilter)

