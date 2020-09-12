export type RequestType = ChatType | 'video-page'
export type ChatType = 'live-chat' | 'replay-live-chat'

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    type: RequestType
}

