/**
 * This is the polling version of the chat queue
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { AdvancedChatLiveActions } from '../models/Chat'


const Sec2MSec = (second: number) => second * 1000
const Player = () => document.getElementsByClassName('html5-main-video')[0] as HTMLVideoElement
const getPlayerCurrentTime = () => Sec2MSec(Player().currentTime)
const PollingDuration = 500

export const useChatQueue = () => {
    const [queue, setQueue] = useState<AdvancedChatLiveActions>([])
    const [dequeued, setDequeued] = useState<AdvancedChatLiveActions>([])
    const [isFreeze, setFreeze] = useState<boolean>(false)
    const isFreezeMemo = useMemo(() => isFreeze, [isFreeze])
    const resetQueue = useCallback(() => setQueue([]), [setQueue])
    const freeze = useCallback(setFreeze, [setFreeze])

    const queueRef = useRef(queue)
    queueRef.current = queue

    const enqueue = (chats: AdvancedChatLiveActions) => {
        if (!isFreeze) setFreeze(false)
        if (chats[0].videoOffsetTimeMsec === 0 || chats[chats.length - 1].videoOffsetTimeMsec < getPlayerCurrentTime())
            setDequeued(chats)
        else
            setQueue(preQueue => [...preQueue, ...chats])
    }

    useEffect(() => {
        if (isFreezeMemo) return
        const id = setInterval(() => {
            const currentTime = getPlayerCurrentTime()
            const readyToBeDequeued = queueRef.current.filter(chat => chat.videoOffsetTimeMsec <= currentTime)
            const stay = queueRef.current.filter(chat => chat.videoOffsetTimeMsec > currentTime)
            setQueue(stay)
            setDequeued(readyToBeDequeued)
        }, PollingDuration)
        return () => clearInterval(id)
    }, [isFreezeMemo])

    // when the queue is reset or empty, stop the polling
    useEffect(() => {
        if (queue.length === 0) setFreeze(true)
    }, [queue])


    return { enqueue, dequeued, freeze, reset: resetQueue }
}
