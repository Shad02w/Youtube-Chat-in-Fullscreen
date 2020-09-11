import React, { useState, createContext, useEffect, useContext, useRef } from 'react'
import { AdvancedChatLiveAction, AdvancedChatLiveActions } from '../models/Chat'
import { PageContext } from './PageContext'

/**
 * This need more work
 * Maybe complete this in future
 */


enum YTPlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
    UNSTARTED = -1
}

interface ChatQueueItem extends AdvancedChatLiveAction {
    timeoutId: number
}

type ChatQueue = Array<ChatQueueItem>
interface IChatQueueContext {
    enqueue(chats: AdvancedChatLiveActions): void
    dequeued: ChatQueue | AdvancedChatLiveActions
}

interface Queue {
    elements: []
}


export const ChatQueue = createContext<IChatQueueContext>({} as IChatQueueContext)



// const CreateSignificantDurationChangeChecker = () => {
//     let lastPlayingTime = 0
//     return (currentTime: number) => {
//         if (lastPlayingTime === 0) lastPlayingTime = currentTime
//         const temp = lastPlayingTime
//         lastPlayingTime = currentTime
//         if (Math.abs(currentTime - temp) >= 1000 * 60)
//             return true
//         else return false
//     }
// }

// const significantDurationChangeChecker = CreateSignificantDurationChangeChecker()


const Sec2MSec = (second: number) => second * 1000
const player = document.getElementsByClassName('html5-main-video')[0] as HTMLVideoElement

export const useChatQueueState = () => {
    const [chatQueue, setChatQueue] = useState<ChatQueue>([])
    const [dequeued, setDequeued] = useState<ChatQueue | AdvancedChatLiveActions>([])
    const [isPaused, pause] = useState<boolean>(false)
    const chatQueueRef = useRef<ChatQueue>(chatQueue)
    chatQueueRef.current = chatQueue


    const setTimedChatQueueItems = (chats: AdvancedChatLiveAction[]): ChatQueue => {
        return chats.map(chat => {
            const timeGap = chat.videoOffsetTimeMsec! - Sec2MSec(player.currentTime || 0)
            return {
                ...chat,
                timeoutId: setTimeout(() => {
                    const depueued = chatQueueRef.current.shift()
                    if (depueued) setChatQueue([depueued])
                }, (timeGap <= 0) ? 0 : timeGap)
            }
        })
    }


    const enqueue = (chats: AdvancedChatLiveAction[]) => {
        if (chats[0].videoOffsetTimeMsec === 0 || chats[chats.length - 1].videoOffsetTimeMsec < Sec2MSec(player.currentTime)) {
            setDequeued(chats)
        } else {
            const newChatQueueItems = setTimedChatQueueItems(chats)
            setChatQueue([...chatQueue, ...newChatQueueItems])
        }
    }

    const clear = () => setChatQueue([])

    const clearTimers = () => chatQueue.map(chat => clearTimeout(chat.timeoutId))
    const resetTimers = () => setChatQueue(setTimedChatQueueItems(chatQueue))

    useEffect(() => {
        console.log('isPaused', isPaused)
        if (isPaused) clearTimers()
        else resetTimers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPaused])


    return { dequeued, enqueue, clear, isPaused, pause }
}

export const useEnable = (init: boolean) => {
    const [isEnable, setEnable] = useState<boolean>(init)
    const enable = () => { if (!isEnable) setEnable(true) }
    const disable = () => { if (isEnable) setEnable(false) }
    return { isEnable, enable, disable }
}




export const ChatQueueProvider: React.FC = ({ children }) => {

    const { pageId, playerState } = useContext(PageContext)


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dequeued, enqueue, clear: clearQueue, isPaused, pause } = useChatQueueState()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => (playerState === YTPlayerState.PAUSED) ? pause(true) : pause(false), [playerState])

    useEffect(() => {
        clearQueue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId])


    return (
        <ChatQueue.Provider value={{ dequeued, enqueue }}>
            {children}
        </ChatQueue.Provider>
    )
}
