import React, { createContext, useState, useEffect, useContext, useRef } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { CatchedLiveChatRequestMessage } from '../models/request'
import { FindObjectByKeyRecursively, ReplayRequest } from '../models/function'
import { ChatActionList, ChatAction } from '../models/chat'
import { ChatQueue } from './ChatQueue'
import { PageContext } from './PageContext'
import { AccordionActions } from '@material-ui/core'



export interface IChatContext {
    chatList: ChatActionList,
    update(list: ChatActionList): void
    reset(): void
}

const DefaultChatRequestTimeout = 5000

const useChatList = (init: ChatActionList): IChatContext => {
    const [chatList, setChatList] = useState<ChatActionList>(init)

    const update = (list: ChatActionList) => setChatList(pre => pre.concat(list).slice(-100))

    const reset = () => setChatList([])

    return { chatList, update, reset }
}


export const ChatContextProvider: React.FC = ({ children }) => {
    // const [chatList, setChatList] = useState<ChatActionList>([])
    const { update: updateChatList, reset: resetChatList, chatList } = useChatList([])
    const { pageId } = useContext(PageContext)
    const chatQueue = useContext(ChatQueue)

    const pageIdRef = useRef(pageId)
    pageIdRef.current = pageId

    function addLiveChats(chatActions: ChatActionList, timeUntilNextRequest: number) {
        // Gradually update the chat list
        const timeInterval = timeUntilNextRequest / chatActions.length

        // Update the chat item to chat list
        chatActions.forEach((action, i) => setTimeout(() => {
            // check whether the chat action is come from previous page
            if (action.pageId === pageIdRef.current)
                updateChatList([action])
        }, i * timeInterval))
    }

    function addUuidToChatActions(chatActions: YTLiveChat.LiveAction[]): ChatActionList {
        return chatActions.map((action): ChatAction => ({
            ...action,
            uuid: uuidV4(),
            pageId: pageIdRef.current,
            vidoOffsetTimeMsec: 0
        }))
    }

    function filterChatActionsWithUndefinedValue(chatActions: ChatActionList): ChatActionList {
        return chatActions.filter(action => !(action.addChatItemAction === undefined
            || action.addChatItemAction.item === undefined
            || action.addChatItemAction.item.liveChatTextMessageRenderer === undefined))
    }

    async function LiveChatRequestListener(message: CatchedLiveChatRequestMessage) {
        if (message.type === 'video-page') return
        const { url } = message.details
        const requestBody = message.requestBody
        const data = await ReplayRequest(url, requestBody)
        if (!data) return
        let actions: YTLiveChat.LiveAction[] = []
        let timeUntilNextRequest: number = DefaultChatRequestTimeout

        try {
            if (message.type === 'live-chat') {
                actions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.LiveAction[] || actions
                timeUntilNextRequest = FindObjectByKeyRecursively(data as Response, 'timeoutMs') || timeUntilNextRequest
                if (!actions) return

                addLiveChats(
                    filterChatActionsWithUndefinedValue(
                        addUuidToChatActions(actions)
                    )
                    , timeUntilNextRequest)
            }
            else if (message.type === 'replay-live-chat') {
                // chatQueue.enable()
                const replayActions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.ReplayLiveAction[] || actions
                if (!replayActions) return
                actions = replayActions
                    .filter(replayAction => replayAction.replayChatItemAction)
                    .map(replayAction => replayAction.replayChatItemAction)
                    // .reduce((arr, replayAction) => {
                    //     const temp: YTLiveChat.LiveAction[] = replayAction.actions.map(action => { return { ...action, vidoOffsetTimeMsec: replayAction.videoOffsetTimeMsec } })
                    //     return arr.concat(temp)
                    // }, [] as YTLiveChat.LiveAction[])
                    .map(({ actions, videoOffsetTimeMsec }) => { return { ...actions[0], videoOffsetTimeMsec } })
                timeUntilNextRequest = FindObjectByKeyRecursively(data as Response, 'timeUntilLastMessageMsec') || timeUntilNextRequest
                // console.log('LiveAction with videoOffset', actions)


                // chatQueue.push(
                //     filterChatActionsWithUndefinedValue(
                //         addUuidToChatActions(actions)
                //     )
                // )

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
    }, [])

    useEffect(() => resetChatList(), [pageId])

    // When the chat queue is enable (Replay live page)
    useEffect(() => updateChatList(chatQueue.released), [chatQueue.released])


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