import React, { createContext, useEffect, useReducer } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { useFetchLiveChatData, useChatActions } from '../hooks/useChatActions'
import { useChatQueue } from '../hooks/useChatQueue'
import { AdvancedChatLiveActions } from '../models/Chat'
import { CatchedLiveChatRequestMessage, PageType } from '../models/Request'

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


    const [AppState, AppStateDispatch] = useReducer(AppcContextReducer, initAppState)
    const { pageId } = AppState
    const { chatActions: fetchedChatActions, pageType } = useFetchLiveChatData(pageId)

    const { chatActions, update: updateChatList, reset: resetChatList } = useChatActions([])

    const { enqueue: enqueueReplayLiveChatQueue, dequeued, reset: resetReplayLiveChatQueue } = useChatQueue()


    useEffect(() => {
        chrome.runtime.onMessage.addListener((message: CatchedLiveChatRequestMessage) => {

        })
    }, [])


    useEffect(() => {
        resetChatList()
        resetReplayLiveChatQueue()
        AppStateDispatch({ type: 'changePageType', pageType: 'normal' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId])

    // when a chats data is fetched
    useEffect(() => {
        if (pageType === 'live-chat') {
            fetchedChatActions.forEach((action, i) => setTimeout(() => {
                if (action.pageId === pageId)
                    updateChatList([action])
            }, i * action.timeUntilNextRequest))
        }
        else if (pageType === 'replay-live-chat') {
            //put chat action to queue instead   push it to  LiveChatList like live chat page
            enqueueReplayLiveChatQueue(fetchedChatActions)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedChatActions, pageType])


    // only use when in replay live page
    useEffect(() => {
        if (pageType !== 'replay-live-chat') return
        updateChatList(dequeued)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dequeued, pageType])



    return (
        <AppContext.Provider value={{ pageId, pageType, chatActions, AppStateDispatch }}>
            {children}
        </AppContext.Provider>
    )
}

