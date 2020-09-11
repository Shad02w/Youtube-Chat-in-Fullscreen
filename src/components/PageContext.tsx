import React, { createContext, useState, useEffect } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { CatchedLiveChatRequestMessage } from '../models/Request'
import { InterceptedDataElementId } from '../models/intercept'

export enum YTPlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
    UNSTARTED = -1
}

interface IPageContext {
    pageId: string,
    playerState: YTPlayerState
}

export const PageContext = createContext<IPageContext>({ pageId: 'undefined', playerState: YTPlayerState.UNSTARTED })

export const PageContextProvider: React.FC = ({ children }) => {

    const [pageId, setPageId] = useState<string>(uuidV4())
    const [interceptedExist, setInterceptedExist] = useState<boolean>(false)
    const [playerState, setPlayerState] = useState<YTPlayerState>(YTPlayerState.UNSTARTED)
    const videoPageRequestListener = (message: CatchedLiveChatRequestMessage) => { if (message.type === 'video-page') setPageId(uuidV4()) }

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

    useEffect(() => {
        chrome.runtime.onMessage.addListener(videoPageRequestListener)
        return () => chrome.runtime.onMessage.removeListener(videoPageRequestListener)
    }, [])

    useEffect(() => {

    })


    return (
        <PageContext.Provider value={{ pageId, playerState }}>
            {children}
        </PageContext.Provider>
    )
}

