export type ChatType = 'live-chat' | 'replay-live-chat'
export type PageType = ChatType | 'normal'

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    type: PageType
}

