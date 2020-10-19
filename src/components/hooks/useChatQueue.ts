/**
 * This is the polling version of the chat queue
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { AdvancedChatLiveActions } from '../../models/Chat'
import { getCurrentPlayerTime } from '../../models/Player'


const PollingDuration = 500

export const useChatQueue = () => {

    const [queue, setQueue] = useState<AdvancedChatLiveActions>([])
    const [dequeued, setDequeued] = useState<AdvancedChatLiveActions>([])
    const [isFreeze, setFreeze] = useState<boolean>(false)

    const resetQueue = useCallback(() => setQueue([]), [setQueue])
    const freezeQueue = useCallback(setFreeze, [setFreeze])

    const queueRef = useRef(queue)
    queueRef.current = queue

    const enqueue = (chats: AdvancedChatLiveActions) => {
        setQueue(preQueue => [...preQueue, ...chats])
    }

    useEffect(() => {
        if (isFreeze) return
        const id = setInterval(() => {
            const currentTime = getCurrentPlayerTime()
            const readyToBeDequeued = queueRef.current.filter(chat => chat.videoOffsetTimeMsec <= currentTime)
            const stay = queueRef.current.filter(chat => chat.videoOffsetTimeMsec > currentTime)
            if (readyToBeDequeued.length === 0) return
            setQueue(stay)
            setDequeued(readyToBeDequeued)
        }, PollingDuration)
        return () => clearInterval(id)
    }, [isFreeze])

    return { enqueue, dequeued, reset: resetQueue, freeze: freezeQueue }
}
