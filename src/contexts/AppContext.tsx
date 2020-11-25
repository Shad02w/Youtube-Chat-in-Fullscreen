import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useChatActions } from '@hooks/useChatActions'
import { useChatQueue } from '@hooks/useChatQueue'
import { usePlayer } from '@hooks/usePlayer'
import { YTPlayerState } from '@models/Player'
import { AdvancedChatLiveActions, EqualAdvancedChatLiveActions } from '@models/Chat'
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
    const { expanded: chatBoxExpanded, ready: chatBoxReady } = useChatBox()

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([], maxChatList)
    const { playerState } = usePlayer()
    const { src: chatFrameSrc, initResponse } = useChatFrame()

    const lastFetchedChatActions = useRef([] as AdvancedChatLiveActions)

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()

    const clearOldChatState = useCallback(
        () => {
            resetChatList()
            resetChatQueue()
            freezeChatQueue(true)
            window.messages.clear()
        },
        [resetChatQueue, freezeChatQueue, resetChatList],
    )

    const startChatQueue = useCallback(() => {
        freezeChatQueue(false)
    }, [freezeChatQueue])


    // Get page Type
    useBackgroundMessage(message => setPageType(message.type))

    // when the app is ready , pop all message from window cached message to trigger the message release event
    useEffect(() => {
        popAllCachedMessage()
    }, [])

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
        , [playerState, pageType])


    // update chatList when new chat actions is released from chat queue
    useEffect(() => {
        updateChatList(dequeued)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dequeued])

    useEffect(() => {
        console.log('chatBox is ready', chatBoxReady, 'expanded?', chatBoxExpanded)
    }, [chatBoxReady, chatBoxExpanded])

    useEffect(() => {
        console.log('initResponse ifrmae', initResponse)
    }, [initResponse])


    useEffect(() => {
        // console.log(chatFrameSrc, 'chatFrameSrc')
        if (!chatFrameSrc) return
        clearOldChatState()
        startChatQueue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatFrameSrc])



    return (
        <AppContext.Provider value={{ pageType, chatActions, freezeChatQueue }}>
            {children}
        </AppContext.Provider>
    )
}

