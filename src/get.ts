const apiKey = 'AIzaSyCNHhtYKFqyZdmG3koM1QKjWGHxe8m9yQg'

// Need to change the d.ts file from namespace gapi.client to gapi.client.youtube
// gapi.load('client', async () => {
//     gapi.client.setApiKey(apiKey)
//     await gapi.client.load('youtube', 'v3')
// })

// type video = gapi.client.youtube.Video

// export const getVideoDetails = async (id: string): Promise<gapi.client.youtube.Video | undefined> => {
//     const res = await gapi.client.youtube.videos.list({
//         part: 'snippet,liveStreamingDetails',
//         id
//     })
//     const { items } = res.result
//     if (items && items.length > 0) {
//         const video = items.find(item => item.id === id)
//         return video
//     }
//     return undefined

// }

// export const getLiveMessages = async (liveChatId: string) => {
//     const res = await gapi.client.youtube.liveChatMessages.list({
//         liveChatId,
//         part: 'snippet,authorDetails'
//     })
//     return res.result
// }