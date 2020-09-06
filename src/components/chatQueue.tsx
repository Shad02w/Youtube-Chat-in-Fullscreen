import React, { useState, createContext, useEffect, useMemo, useContext } from 'react'
import { ChatLiveAction } from '../models/chat'
import { PageContext } from './PageContext'

export interface YtVideoElement extends HTMLVideoElement {
    getCurrentTime(): number
}

type ChatQueueItem = ChatLiveAction

interface IChatQueueContext {
    enable(): void
    push(chats: ChatQueueItem[] | ChatQueueItem): void
    released: ChatQueueItem[]

}


type ChatQueue = Array<ChatQueueItem>
export const ChatQueue = createContext<IChatQueueContext>({} as IChatQueueContext)

const sec2MSec = (second: number) => second * 1000


// return time in second
export const getCurrentVideoTime = (): number => {
    const videoTags = document.getElementsByTagName('video')
    const video = Array.from(videoTags)
        .find(videoTag => videoTag.classList.contains('html5-main-video')) || videoTags[0]


    const currentTime = (video as YtVideoElement).getCurrentTime()
    return currentTime
}

export const useChatQueueState = () => {
    const [chatQueue, setChatQueue] = useState<ChatQueue>([])

    const release = (offsetTime: number) => {
        const poped = chatQueue.filter(chat => chat.vidoOffsetTimeMsec <= offsetTime)
        const stay = chatQueue.filter(chat => chat.vidoOffsetTimeMsec > offsetTime)
        setChatQueue(stay)
        return poped
    }

    const push = (chats: ChatQueueItem[] | ChatQueueItem) => {
        (Array.isArray(chats)) ?
            setChatQueue([...chatQueue, ...chats]) :
            setChatQueue([...chatQueue, chats])
    }

    const clear = () => setChatQueue([])

    return { release, push, clear }

}

const pollingDuration = 100

export const ChatQueueProvider: React.FC = ({ children }) => {
    const [isEnable, setEnable] = useState<boolean>(false)
    const [released, setReleased] = useState<ChatQueueItem[]>([])
    const { pageId } = useContext(PageContext)
    const enable = () => setEnable(true)
    const isEnableMemo = useMemo(() => isEnable, [isEnable])

    const { release, push, clear: clearQueue } = useChatQueueState()



    const ChatQueuePolling = () => {
        const currentVideoTime = sec2MSec(getCurrentVideoTime())
        const toBeAdded = release(currentVideoTime)

        setReleased(toBeAdded)
    }

    useEffect(() => {
        if (isEnableMemo) {
            const id = setInterval(ChatQueuePolling, pollingDuration)
            return () => {
                clearInterval(id)
            }
        }
    }, [isEnableMemo])

    useEffect(() => {
        clearQueue()
        setEnable(false)
    }, [pageId])

    useEffect(() => {
        console.log('chat queue release', released)
    }, [released])

    return (
        <ChatQueue.Provider value={{ enable, push, released }}>
            {children}
        </ChatQueue.Provider>
    )
}
