import React, { createContext, useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { CatchedLiveChatRequestMessage, ChatType } from '../models/Request'
import { FindObjectByKeyRecursively, ReplayRequest } from '../models/Function'
import { AdvancedChatLiveActions, AdvancedChatLiveAction, ChatLiveActionWithVideoOffsetTime } from '../models/Chat'
import { PageContext, YTPlayerState } from './PageContext'
import { useChatQueue } from './useChatQueue'



export interface IChatContext {
    chatList: AdvancedChatLiveActions,
    update(list: AdvancedChatLiveActions): void
    reset(): void
}


const DefaultChatRequestTimeout = 5000
const MaxChatsItem = 250

function createAdvanceChatLiveActions(chatActions: ChatLiveActionWithVideoOffsetTime[], pageId: string): AdvancedChatLiveActions {
    return chatActions.map((action): AdvancedChatLiveAction => ({
        ...action,
        uuid: uuidV4(),
        pageId
    }))
}

function filterChatActionsWithUndefinedValue(chatActions: AdvancedChatLiveActions): AdvancedChatLiveActions {
    return chatActions.filter(action => !(action.addChatItemAction === undefined
        || action.addChatItemAction.item === undefined
        || action.addChatItemAction.item.liveChatTextMessageRenderer === undefined))
}

const useChatList = (init: AdvancedChatLiveActions): IChatContext => {
    const [chatList, setChatList] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatList(pre => pre.concat(list).slice(-MaxChatsItem)), [setChatList])

    const reset = useCallback(() => setChatList([]), [setChatList])

    return { chatList, update, reset }
}


export const ChatContextProvider: React.FC = ({ children }) => {

    const { pageId, playerState } = useContext(PageContext)

    const { update: updateChatList, reset: resetChatList, chatList } = useChatList([])
    const chatQueue = useChatQueue()
    const { freeze: freezeChatQueue, reset: resetChatQueue } = chatQueue

    const [mode, setMode] = useState<ChatType>('live-chat')
    const modeMemo = useMemo(() => mode, [mode])

    const pageIdRef = useRef(pageId)
    pageIdRef.current = pageId

    function addLiveChats(chatActions: AdvancedChatLiveActions, timeUntilNextRequest: number) {
        // Gradually update the chat list
        if (chatActions.length === 0) return
        const timeInterval = timeUntilNextRequest / chatActions.length
        // Update the chat item to chat list
        chatActions.forEach((action, i) => setTimeout(() => {
            // check whether the chat action is come from previous page
            if (action.pageId === pageIdRef.current)
                updateChatList([action])
        }, i * timeInterval))
    }


    async function LiveChatRequestListener(message: CatchedLiveChatRequestMessage) {
        if (message.type === 'video-page') return
        const { url } = message.details
        const requestBody = message.requestBody
        const data = await ReplayRequest(url, requestBody)
        if (!data) return
        let actions: ChatLiveActionWithVideoOffsetTime[] = []

        try {
            if (message.type === 'live-chat') {
                setMode('live-chat')
                actions = (FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.LiveAction[] || actions)
                    .map(action => Object.assign(action, { videoOffsetTimeMsec: 0 }))
                const timeUntilNextRequest = FindObjectByKeyRecursively(data as Response, 'timeoutMs') || DefaultChatRequestTimeout
                if (!actions || actions.length === 0) return

                addLiveChats(
                    filterChatActionsWithUndefinedValue(
                        createAdvanceChatLiveActions(actions, pageIdRef.current)
                    )
                    , timeUntilNextRequest)
            }
            else if (message.type === 'replay-live-chat') {
                setMode('replay-live-chat')
                const replayActions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.ReplayLiveAction[] || actions
                // const timeUntilNextRequest = FindObjectByKeyRecursively(data as Response, 'timeUntilLastMessageMsec') || DefaultChatRequestTimeout
                if (!replayActions || replayActions.length === 0) return
                actions = replayActions
                    .filter(replayAction => replayAction.replayChatItemAction)
                    .map(replayAction => replayAction.replayChatItemAction)
                    .map(({ actions: liveActions, videoOffsetTimeMsec }) => { return { ...liveActions[0], videoOffsetTimeMsec: parseFloat(videoOffsetTimeMsec) } })
                if (!actions || actions.length === 0) return

                chatQueue.enqueue(
                    filterChatActionsWithUndefinedValue(
                        createAdvanceChatLiveActions(actions, pageIdRef.current)
                    )
                )
            }
        } catch (error) {
            console.error(error, 'ChatList is failed to fetch or Chat Response structure has been changed')
        }
    }

    useEffect(() => {
        chrome.runtime.onMessage.addListener(LiveChatRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(LiveChatRequestListener)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        resetChatList()
        resetChatQueue()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId])

    // When the chat queue is enable (Replay live page)
    useEffect(() => {
        if (chatQueue.dequeued && modeMemo === 'replay-live-chat')
            updateChatList(chatQueue.dequeued)
    }, [chatQueue.dequeued, modeMemo, updateChatList])


    useEffect(() => (playerState === YTPlayerState.PAUSED) ? freezeChatQueue(true) : freezeChatQueue(false), [playerState, freezeChatQueue])

    const initContext: IChatContext = {
        chatList,
        update: updateChatList,
        reset: resetChatList
    }

    return (
        <ChatContext.Provider value={initContext}>
            {children}
        </ChatContext.Provider>
    )

}


export const ChatContext = createContext<IChatContext>({} as IChatContext)