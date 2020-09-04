import { ChatLiveAction } from './chat'


interface ChatQueueItem extends ChatLiveAction {
    videoOffsetTime: number
}


type ChatQueue = Array<ChatQueueItem>

export let chatQueue: ChatQueue | undefined = undefined

export const createQueue = (): ChatQueue => {
    const a = [] as ChatQueue
    return a

}

export const getQueue = (): ChatQueue => {
    if (chatQueue) return chatQueue
    return []
}
