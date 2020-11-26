import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useChatActions } from '@hooks/useChatActions'
import { useChatQueue } from '@hooks/useChatQueue'
import { usePlayer } from '@hooks/usePlayer'
import { YTPlayerState } from '@models/Player'
import { AdvancedChatLiveActions } from '@models/Chat'
import { ContentScriptWindow } from '@models/Window'
import { useLiveChatActions } from '@hooks/useLiveChatActions'
import { useBackgroundMessage } from '@hooks/useBackgroundMessage'
import { PageType } from '@models/Request'
import { useChatBox } from '@hooks/useChatBox'
import { useChatFrame } from '@hooks/useChatFrame'

declare const window: ContentScriptWindow

export interface AppState {
    pageType: PageType | undefined
    chatActions: AdvancedChatLiveActions
    freezeChatQueue(value: boolean): void
}


export const AppContext = createContext<AppState>({} as AppState)

const popAllCachedMessage = () => {
    if (window.ready) return
    window.ready = true
    window.messages.popAll()
}


export const AppContextProvider: React.FC = ({ children }) => {


    const [maxChatList] = useState<number>(70)
    const { chatActions: fetchedChatActions } = useLiveChatActions()
    const [pageType, setPageType] = useState<PageType>('normal')

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([], maxChatList)
    const { playerState } = usePlayer()

    const { expanded: chatBoxExpanded } = useChatBox()
    const { ready: chatFrameReady } = useChatFrame()

    const lastFetchedChatActions = useRef([] as AdvancedChatLiveActions)

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()

    const clearOldChatState = useCallback(
        () => {
            resetChatList()
            resetChatQueue()
            window.messages.clear()
        },
        [resetChatQueue, resetChatList],
    )

    // Get page Type
    useBackgroundMessage(message => setPageType(message.type))

    // when the app is ready , pop all message from window cached message to trigger the message release event
    useEffect(() => popAllCachedMessage(), [])

    // when a chats data is fetched
    useEffect(() => {
        // both the live page and live replay page will use the polling chat queue
        if (fetchedChatActions.length === 0) return
        lastFetchedChatActions.current = fetchedChatActions
        enqueueChatQueue(fetchedChatActions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedChatActions])

    // freeze chat queue when player pause in replay live mode
    useEffect(() => {
        if (playerState === YTPlayerState.PAUSED && (pageType === 'replay-live-chat' || pageType === 'init-replay-live-chat'))
            freezeChatQueue(true)
        else
            freezeChatQueue(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerState, pageType])

    // update chatList when new chat actions is released from chat queue
    useEffect(() => {
        updateChatList(dequeued)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dequeued])

    useEffect(() => {
        if (chatFrameReady) {
            freezeChatQueue(false)
        } else {
            clearOldChatState()
            freezeChatQueue(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatFrameReady])

    return (
        <AppContext.Provider value={{ pageType, chatActions, freezeChatQueue }}>
            {children}
        </AppContext.Provider>
    )
}

