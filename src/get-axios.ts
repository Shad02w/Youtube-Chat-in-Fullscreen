import axios, { AxiosResponse } from 'axios'

const apiKey = 'AIzaSyCNHhtYKFqyZdmG3koM1QKjWGHxe8m9yQg'

type Video = gapi.client.youtube.Video



export const getVideoDetails = async (video_id: string): Promise<Video | undefined> => {
    const req = axios.request<any, AxiosResponse<gapi.client.youtube.VideoListResponse>>({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        responseType: 'json',
        params: {
            part: 'snippet,liveStreamingDetails',
            id: video_id,
            key: apiKey
        }
    })
    let res: undefined | AxiosResponse<gapi.client.youtube.VideoListResponse> = undefined
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


export const getLiveMessages = async (liveChatId: string, nextPageToken?: string) => {
    const liveChatRequest = axios.request<any, AxiosResponse<gapi.client.youtube.LiveChatMessageListResponse>>({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
        responseType: 'json',
        params: {
            liveChatId,
            part: 'snippet,authorDetails',
            key: apiKey,
            pageToken: nextPageToken ? nextPageToken : undefined
        }
    })


    try {
        const res = await liveChatRequest
        return res.data
    } catch (error) {
        console.error(error.response.data)
        return undefined
    }
}