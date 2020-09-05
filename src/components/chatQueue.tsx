import React, { useState, useRef, createContext, useEffect } from 'react'
import { ChatLiveAction } from '../models/chat'


export interface YtVideoElement extends HTMLVideoElement {
    getCurrentTime(): string
}

interface ChatQueueItem extends ChatLiveAction {
    videoOffsetTime: number
}
interface IChatQueueContext {

}

type ChatQueue = Array<ChatQueueItem>

// export const getCurrentVideoTime = (): string => {
//     const videoTags = document.getElementsByTagName('video')
//     const video = Array.from(videoTags)
//         .find(videoTag => videoTag.classList.contains('html5-main-video')) || videoTags[0]


//     const currentTime = (video as YtVideoElement).getCurrentTime()
//     return currentTime
// }

export const ChatQueue = createContext<IChatQueueContext>({} as IChatQueueContext)

export const useChatQueueState = () => {
    const [chatQueue, setChatQueue] = useState<ChatQueue>([])
    const [enable, isEnable] = useState<boolean>(false)


    useEffect(() => {

        return () => {

        }
    }, [enable])


    const release = (offsetTime?: number) => {
        if (!offsetTime) {
            setChatQueue([])
            return chatQueue.map(chat => chat)
        }
        else {
            const re = chatQueue.filter(chat => chat.videoOffsetTime < offsetTime)
            const keep = chatQueue.filter(chat => chat.videoOffsetTime > offsetTime)
            setChatQueue(keep)
            return re
        }
    }
    return { chatQueue, release }

}



export const ChatQueueProvider: React.FC = ({ children }) => {
    const { release } = useChatQueueState()
    return (
        <ChatQueue.Provider value={{}}>
            {children}
        </ChatQueue.Provider>
    )
}
