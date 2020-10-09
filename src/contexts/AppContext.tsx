import React, { createContext, useEffect, useReducer, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { useFetchedLiveChatData, useChatActions } from '../hooks/useChatActions'
import { useChatQueue } from '../hooks/useChatQueue'
import { usePlayerState, YTPlayerState } from '../hooks/usePlayerState'
import { AdvancedChatLiveActions } from '../models/Chat'
import { PageType } from '../models/Request'

export interface AppState {
    pageId: string
    pageType: PageType
    chatActions: AdvancedChatLiveActions
}

export interface IAppContext extends AppState {
    AppStateDispatch: React.Dispatch<AppStateReducerAction>,
}

export type AppStateReducerAction =
    {
        type: 'changePageId', pageId: string
    } |
    {
        type: 'changePageType', pageType: PageType
    }


const initAppState: AppState = {
    pageId: uuidV4(),
    pageType: 'normal',
    chatActions: []
}


export const AppContext = createContext<IAppContext>({} as IAppContext)

export const AppcContextReducer: React.Reducer<AppState, AppStateReducerAction> = (preState, action) => {
    switch (action.type) {
        case 'changePageId':
            return { ...preState, pageId: action.pageId }
        case 'changePageType':
            return { ...preState, pageType: action.pageType }
        default:
            return preState
    }
}

export const AppContextProvider: React.FC = ({ children }) => {


    const [maxChatList] = useState<number>(70)
    const [AppState, AppStateDispatch] = useReducer(AppcContextReducer, initAppState)
    const { pageId } = AppState
    const { chatActions: fetchedChatActions, pageType } = useFetchedLiveChatData(pageId)

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([], maxChatList)
    const { playerState } = usePlayerState()

    // use in replay live page
    const { enqueue: enqueueChatQueue, dequeued, reset: resetChatQueue, freeze: freezeChatQueue } = useChatQueue()

    const pageIdRef = useRef(pageId)
    pageIdRef.current = pageId

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

        AppStateDispatch({ type: 'changePageType', pageType })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageType])

    // when a chats data is fetched
    useEffect(() => {
        // both the live page and live replay page will use the polling chat queue
        enqueueChatQueue(fetchedChatActions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedChatActions])

    useEffect(() => {
        console.log('pageType', pageType)
    }, [pageType])

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
        <AppContext.Provider value={{ pageId, pageType, chatActions, AppStateDispatch }}>
            {children}
        </AppContext.Provider>
    )
}

