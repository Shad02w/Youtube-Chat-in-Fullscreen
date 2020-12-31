import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useChatActions } from '@hooks/useChatActions'
import { useChatQueue } from '@hooks/useChatQueue'
import { usePlayerState } from '@hooks/usePlayerState'
import { YTPlayerState } from '@models/Player'
import { AdvancedChatLiveActions } from '@models/Chat'
import { ContentScriptWindow } from '@models/Window'
import { useLiveChatActions } from '@hooks/useLiveChatActions'
import { useBackgroundMessage } from '@hooks/useBackgroundMessage'
import { PageType } from '@models/Request'
import { useUrl } from '@hooks/useUrl'

declare const window: ContentScriptWindow

export interface AppState {
    pageType: PageType | undefined
    chatActions: AdvancedChatLiveActions
    freezeChatQueue(value: boolean): void
}

const popAllCachedMessage = () => {
    if (window.ready) return
    window.ready = true
    window.messages.popAll()
}

export const AppContext = createContext<AppState>({} as AppState)


export const AppContextProvider: React.FC = ({ children }) => {


    const [maxChatList] = useState<number>(70)
    const { chatActions: fetchedChatActions } = useLiveChatActions()
    const [pageType, setPageType] = useState<PageType>('normal')

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([], maxChatList)
    const { playerState } = usePlayerState()

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()

    const resetChatState = useCallback(() => {
        resetChatList()
        resetChatQueue()
        freezeChatQueue(false)
        window.messages.clear()
    }, [resetChatQueue, resetChatList, freezeChatQueue])

    // Get page Type
    useBackgroundMessage(message => setPageType(message.type))

    useUrl(() => resetChatState())

    // when the app is ready, pop all message from window cached message to trigger the message release event
    useEffect(popAllCachedMessage, [])

    useEffect(() => {
        // both the live page and live replay page will use the polling chat queue
        if (pageType === 'normal' || fetchedChatActions.length === 0) return
        enqueueChatQueue(fetchedChatActions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedChatActions])

    useEffect(() => (playerState === YTPlayerState.PAUSED && pageType === 'replay-live-chat')
        ? freezeChatQueue(true)
        : freezeChatQueue(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [playerState, pageType])

    useEffect(() => {

        //TODO: check the status of chat box exist or not

        updateChatList(dequeued)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dequeued])


    return (
        <AppContext.Provider value={{ pageType, chatActions, freezeChatQueue }}>
            {children}
        </AppContext.Provider>
    )
}

