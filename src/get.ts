import axios from 'axios'

const apiKey = 'AIzaSyCNHhtYKFqyZdmG3koM1QKjWGHxe8m9yQg'

export const getVideoDetails = async (video_id: string): Promise<any> => {
    const req = axios.request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        responseType: 'json',
        params: {
            part: 'snippet,liveStreamingDetails',
            id: video_id,
            key: apiKey
        }
    })
    let res = undefined
    try {
        res = await req
    } catch (error) {
        console.error(error.response.data)
        return undefined
    }

    if (res.data.items && res.data.items.length > 0) {
        // since the api allow to find multiple video id deatil in one api request, so the return 'items' is a array
        // find the one with the same video id of the url
        const videoResource = res.data.items.find((item: any) => item.id === video_id)
        return videoResource
    }
    return undefined
}

export const getLiveMessages = async (liveChatId: string) => {
    const liveChatRequest = axios.request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
        responseType: 'json',
        params: {
            liveChatId,
            part: 'snippet,authorDetails',
            key: apiKey
        }
    })
    try {
        const res = await liveChatRequest
        console.log('liveChat', res.data)
        return res.data
    } catch (error) {
        console.error(error.response.data)
        return undefined
    }
}