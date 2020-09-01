import { createContext } from 'react'

interface ChatAction extends YoutubeLiveChat.LiveChatContinuationAction {
    uuid: string
    pageId: string
}

export type ChatActionList = ChatAction[]

export interface IChatContext {
    pageId: string,
    chatList: ChatActionList,
    update(list: ChatActionList): void
    reset(): void
}

export const ChatContext = createContext<IChatContext>({} as IChatContext)