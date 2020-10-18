import React, { createContext, useEffect, useState } from 'react'
import { useFetchedLiveChatData, useChatActions } from '../components/hooks/useChatActions'
import { useChatQueue } from '../components/hooks/useChatQueue'
import { usePlayerState, YTPlayerState } from '../components/hooks/usePlayerState'
import { AdvancedChatLiveActions } from '../models/Chat'
import { PageType } from '../models/Request'

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

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()


    // side effect of page change
    useEffect(() => {
        if (pageType === 'normal') {
            resetChatList()
            resetChatQueue()
            freezeChatQueue(true)
        }
        else {
            freezeChatQueue(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageType])

    // when a chats data is fetched
    useEffect(() => {
        // both the live page and live replay page will use the polling chat queue
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

