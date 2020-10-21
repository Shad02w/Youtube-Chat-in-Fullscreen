import React, { createContext, useEffect, useRef, useState } from 'react'
import { useFetchedLiveChatData, useChatActions } from '../components/hooks/useChatActions'
import { useChatQueue } from '../components/hooks/useChatQueue'
import { usePlayerState } from '../components/hooks/usePlayerState'
import { YTPlayerState } from '../models/Player'
import { AdvancedChatLiveActions, EqualAdvancedChatLiveActions } from '../models/Chat'
import { PageType } from '../models/Request'
import { ContentScriptWindow } from '../models/Window'

declare const window: ContentScriptWindow
export interface AppState {
    pageType: PageType
    chatActions: AdvancedChatLiveActions
}


export const AppContext = createContext<AppState>({
    pageType: 'normal',
    chatActions: []
})


export const AppContextProvider: React.FC = ({ children }) => {


    const [maxChatList] = useState<number>(70)
    const { chatActions: fetchedChatActions, pageType } = useFetchedLiveChatData()

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([], maxChatList)
    const { playerState } = usePlayerState()

    const lastFetchedChatActions = useRef([] as AdvancedChatLiveActions)

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()


    // side effect of page change
    useEffect(() => {
        if (pageType === 'normal') {
            console.log('new page')
            resetChatList()
            resetChatQueue()
            freezeChatQueue(true)
            window.messageQueue = []
        }
        else {
            freezeChatQueue(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageType])

    // when a chats data is fetched
    useEffect(() => {
        // both the live page and live replay page will use the polling chat queue
        if (pageType === 'normal'
            || fetchedChatActions.length === 0
            || EqualAdvancedChatLiveActions(lastFetchedChatActions.current, fetchedChatActions)) return

        lastFetchedChatActions.current = fetchedChatActions
        enqueueChatQueue(fetchedChatActions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedChatActions])

    useEffect(() => (playerState === YTPlayerState.PAUSED && pageType === 'replay-live-chat')
        ? freezeChatQueue(true)
        : freezeChatQueue(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [playerState, pageType]
    )
    useEffect(() => {
        updateChatList(dequeued)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dequeued])

    return (
        <AppContext.Provider value={{ pageType, chatActions }}>
            {children}
        </AppContext.Provider>
    )
}

