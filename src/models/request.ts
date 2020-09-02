type RequestType = 'live-chat' | 'replay-live-chat' | 'video-page'

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    type: RequestType
}

