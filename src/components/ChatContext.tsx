import React, { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { CatchedLiveChatRequestMessage } from '../models/request'
import { FindObjectByKeyRecursively, ReplayRequest } from '../models/function'
import { ChatActionList } from '../models/chat'



export interface IChatContext {
    pageId: string,
    chatList: ChatActionList,
    update(list: ChatActionList): void
    reset(): void
}

export const ChatContextProvider: React.FC = ({ children }) => {
    const [chatList, setChatList] = useState<ChatActionList>([])
    const [pageId, setPageId] = useState<string>(uuidV4())
    const update = (list: ChatActionList) => setChatList(pre => pre.concat(list).slice(-100))
    const pageIdRef = useRef(pageId)
    pageIdRef.current = pageId

    async function LiveChatRequestListener(message: CatchedLiveChatRequestMessage) {
        if (message.type === 'video-page') return setPageId(uuidV4())
        const { url } = message.details
        const requestBody = message.requestBody
        const data = await ReplayRequest(url, requestBody)
        if (!data) return
        let actions: YTLiveChat.LiveAction[] | undefined = []

        try {
            if (message.type === 'live-chat') {
                actions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.LiveAction[]
            }
            else if (message.type === 'replay-live-chat') {
                const replayActions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.ReplayLiveAction[]
                if (!replayActions) return
                actions = replayActions
                    .map(replayAction => replayAction.replayChatItemAction.actions)
                    .filter(actions => actions)
                    .reduce((pre, curr) => pre.concat(curr), [])
            }
        } catch (error) {
            console.error(error)
            actions = []
        }
        if (!actions) return

        const actionsWithUuid = actions.map((action) => ({
            ...action,
            uuid: uuidV4(),
            pageId: pageIdRef.current
        })) as ChatActionList


        const filteredActions = actionsWithUuid
            .filter(action => {
                return !(action.addChatItemAction === undefined
                    || action.addChatItemAction.item === undefined
                    || action.addChatItemAction.item.liveChatTextMessageRenderer === undefined);
            })

        // Gradually update the chat list
        const timeout = FindObjectByKeyRecursively(data as Response, 'timeoutMs')
            || FindObjectByKeyRecursively(data as Response, 'timeUntilLastMessageMsec')
        const tti = parseFloat(timeout) || 5000
        const timeInterval = tti / filteredActions.length
        filteredActions.forEach((action, i) => setTimeout(() => {
            // check whether the chat action is come from previous page
            if (action.pageId === pageIdRef.current)
                update([action])
        }, i * timeInterval))
    }


    useEffect(() => {
        chrome.runtime.onMessage.addListener(LiveChatRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(LiveChatRequestListener)
        }
    }, [])

    useEffect(() => {
        const video = document.getElementsByTagName('video')[0]
        const getCurrentTime = () => {
            video.currentTime
            requestAnimationFrame(getCurrentTime)

        }
        requestAnimationFrame(getCurrentTime)
    }, [])

    useEffect(() => {
        setChatList([])
    }, [pageId])


    const initContext: IChatContext = {
        chatList,
        pageId: pageId,
        update,
        reset: () => setChatList([])
    }

    return (
        <ChatContext.Provider value={initContext}>
            {children}
        </ChatContext.Provider>
    )

}


export const ChatContext = createContext<IChatContext>({} as IChatContext)