/**
 * This is the polling version of the chat queue
 */
import { useState, useEffect, useRef, useMemo } from 'react'
import { AdvancedChatLiveActions } from '../models/Chat'


const Sec2MSec = (second: number) => second * 1000
const Player = () => document.getElementsByClassName('html5-main-video')[0] as HTMLVideoElement
const getPlayerCurrentTime = () => Sec2MSec(Player().currentTime)
const PollingDuration = 300

export const useChatQueue = () => {
    const [queue, setQueue] = useState<AdvancedChatLiveActions>([])
    const [dequeued, setDequeued] = useState<AdvancedChatLiveActions>([])
    const [isFreeze, freeze] = useState<boolean>(false)
    const isFreezeMemo = useMemo(() => isFreeze, [isFreeze])

    const queueRef = useRef(queue)
    queueRef.current = queue

    const enqueue = (chats: AdvancedChatLiveActions) => {
        if (chats[0].videoOffsetTimeMsec == 0 || chats[chats.length - 1].videoOffsetTimeMsec < getPlayerCurrentTime())
            setDequeued(chats)
        else
            setQueue(preQueue => [...preQueue, ...chats])
    }

    useEffect(() => {
        if (isFreeze) return
        const id = setInterval(() => {
            const currentTime = getPlayerCurrentTime()
            console.log(currentTime)
            const readyToBeDequeued = queueRef.current.filter(chat => chat.videoOffsetTimeMsec <= currentTime)
            const stay = queueRef.current.filter(chat => chat.videoOffsetTimeMsec > currentTime)
            setQueue(stay)
            setDequeued(readyToBeDequeued)
        }, PollingDuration)
        return () => clearInterval(id)
    }, [isFreezeMemo])


    return { enqueue, dequeued, freeze }
}
