import { useState, useEffect, useCallback } from 'react'
import { AdvancedChatLiveActions, AdvancedChatLiveAction, ChatLiveActionWithVideoOffsetTime } from '../models/Chat'
import { CatchedLiveChatRequestMessage, PageType } from '../models/Request'
import { FetchData, FindObjectByKeyRecursively } from '../models/Function'
import { v4 as uuidV4 } from 'uuid'

const DefaultChatRequestInterval = 5000
const MaxChatsItem = 250

function filterChatActionsWithUndefinedValue(chatActions: ChatLiveActionWithVideoOffsetTime[]): ChatLiveActionWithVideoOffsetTime[] {
    return chatActions.filter(action => !(action.addChatItemAction === undefined
        || action.addChatItemAction.item === undefined
        || action.addChatItemAction.item.liveChatTextMessageRenderer === undefined))
}

function createAdvanceChatLiveActions(chatActions: ChatLiveActionWithVideoOffsetTime[], pageId: string): AdvancedChatLiveActions {
    return chatActions.map((action): AdvancedChatLiveAction => ({
        ...action,
        uuid: uuidV4(),
        pageId,
    }))
}

export const useChatActions = (init: AdvancedChatLiveActions) => {
    const [chatActions, setChatActioins] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatActioins(pre => pre.concat(list).slice(-MaxChatsItem)), [setChatActioins])

    const reset = useCallback(() => setChatActioins([]), [setChatActioins])

    return { chatActions, update, reset }
}

export const useFetchLiveChatData = (pageId: string) => {
    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const [pageType, setPageType] = useState<PageType>('normal')


    useEffect(() => {

        const LiveChatRequestListener = async (message: CatchedLiveChatRequestMessage) => {
            setPageType(message.type)
            if (message.type === 'normal') return

            try {
                let actions: ChatLiveActionWithVideoOffsetTime[] = []
                const { details: { url }, requestBody } = message
                const data = await FetchData(url, requestBody)
                if (!data) return
                if (message.type === 'live-chat') {
                    const timeUntilNextRequest = FindObjectByKeyRecursively(data as Response, 'timeoutMs') || DefaultChatRequestInterval
                    actions = (FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.LiveAction[] || actions)
                        .map((action, i, arr) => Object.assign(action, { videoOffsetTimeMsec: i * (timeUntilNextRequest / arr.length) }))

                    setChatActions(
                        createAdvanceChatLiveActions(filterChatActionsWithUndefinedValue(actions), pageId)
                    )
                } else if (message.type === 'replay-live-chat') {
                    const replayActions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.ReplayLiveAction[] || actions
                    if (!replayActions || replayActions.length === 0) return
                    actions = replayActions
                        .filter(replayAction => replayAction.replayChatItemAction)
                        .map(replayAction => replayAction.replayChatItemAction)
                        .map(({ actions: liveActions, videoOffsetTimeMsec }) => { return { ...liveActions[0], videoOffsetTimeMsec: parseFloat(videoOffsetTimeMsec) } })
                    if (!actions || actions.length === 0) return
                    setChatActions(
                        createAdvanceChatLiveActions(filterChatActionsWithUndefinedValue(actions), pageId)
                    )
                }
            } catch (error) {
                console.error(error)
                return
            }
        }

        chrome.runtime.onMessage.addListener(LiveChatRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(LiveChatRequestListener)
        }
    }, [pageId])

    return { chatActions, pageType }
}
