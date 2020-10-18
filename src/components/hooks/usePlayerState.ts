import { useState, useEffect } from 'react'
import { InterceptedDataElementId } from '../../models/Intercept'

export enum YTPlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
    UNSTARTED = -1
}
export const usePlayerState = () => {

    const [interceptedExist, setInterceptedExist] = useState<boolean>(false)
    const [playerState, setPlayerState] = useState<YTPlayerState>(YTPlayerState.UNSTARTED)


    useEffect(() => {
        const interceptedObserver = new MutationObserver(() => {
            if (document.getElementById(InterceptedDataElementId)) {
                setInterceptedExist(true)
                interceptedObserver.disconnect()
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => {
            interceptedObserver.disconnect()
        }
    }, [])


    useEffect(() => {
        if (interceptedExist) {
            const interceptedElment = document.getElementById(InterceptedDataElementId) as HTMLDivElement
            const observer = new MutationObserver((mutations) => {
                const childMutation = mutations.find(mutation => mutation.type === 'childList')
                if (!childMutation) return
                const state = parseInt((childMutation.target as HTMLDivElement).innerHTML) as YTPlayerState
                setPlayerState(state)
            })
            observer.observe(interceptedElment, { childList: true, subtree: true })
            return () => observer.disconnect()
        }
    }, [interceptedExist])

    return { playerState }
}
