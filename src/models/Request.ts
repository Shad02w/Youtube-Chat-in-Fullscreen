export type ChatType = 'live-chat' | 'replay-live-chat'
export type PageType = ChatType | 'normal'

export interface RequestHeader {
    name: string,
    value: string
}

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    requestHeaders?: chrome.webRequest.HttpHeader[]
    type: PageType
}

