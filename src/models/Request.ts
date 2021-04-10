import parse from 'url-parse'
export type ChatType = 'live-chat' | 'replay-live-chat' | 'init-live-chat' | 'init-replay-live-chat'
export type PageType = ChatType | 'normal'

export interface RequestHeader {
    name: string
    value: string
}

export interface CatchedLiveChatRequestMessage {
    details: chrome.webRequest.WebRequestDetails
    requestBody?: JSON
    requestHeaders?: chrome.webRequest.HttpHeader[]
    type: PageType
}

export const getPageType = (url: string): PageType => {
    const pathname = parse(url).pathname
    if (pathname.includes('/get_live_chat_replay')) return 'replay-live-chat'
    else if (pathname.includes('/get_live_chat')) return 'live-chat'
    else if (pathname.endsWith('/live_chat_replay')) return 'init-replay-live-chat'
    else if (pathname.endsWith('/live_chat')) return 'init-live-chat'
    return 'normal'
}
