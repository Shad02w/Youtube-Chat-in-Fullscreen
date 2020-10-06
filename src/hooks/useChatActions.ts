import { useState, useEffect, useCallback } from 'react'
import { AdvancedChatLiveActions, AdvancedChatLiveAction, ChatLiveActionWithVideoOffsetTime } from '../models/Chat'
import { CatchedLiveChatRequestMessage, ChatType, PageType } from '../models/Request'
import { FetchData, FindObjectByKeyRecursively } from '../models/Function'
import { v4 as uuidV4 } from 'uuid'
import { getCurrentPlayerTime } from '../models/Player'

const DefaultChatRequestInterval = 5000

function filterChatActionsWithUndefinedValue(chatActions: ChatLiveActionWithVideoOffsetTime[]): ChatLiveActionWithVideoOffsetTime[] {
    return chatActions.filter(action => action.addChatItemAction && action.addChatItemAction.item)
        .filter(({ addChatItemAction }) => addChatItemAction!.item.liveChatTextMessageRenderer
            || addChatItemAction!.item.liveChatPaidMessageRenderer
            || addChatItemAction!.item.liveChatMembershipItemRenderer)
}

function createAdvanceChatLiveActions(chatActions: ChatLiveActionWithVideoOffsetTime[], pageId: string): AdvancedChatLiveActions {
    return chatActions.map((action): AdvancedChatLiveAction => ({
        ...action,
        uuid: uuidV4(),
        pageId,
    }))
}

export const useChatActions = (init: AdvancedChatLiveActions, max: number) => {
    const [chatActions, setChatActioins] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatActioins(pre => pre.concat(list).slice(-max)), [setChatActioins, max])

    const reset = useCallback(() => setChatActioins([]), [setChatActioins])

    return { chatActions, update, reset }
}

export const useFetchedLiveChatData = (pageId: string) => {
    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const [pageType, setPageType] = useState<PageType>('normal')


    useEffect(() => {

        const WebRequestListener = async (message: CatchedLiveChatRequestMessage) => {
            setPageType(message.type)
            if (message.type === 'normal') return

            try {
                let actions: ChatLiveActionWithVideoOffsetTime[] = []
                const { details: { url }, requestBody } = message
                const data = await FetchData(url, requestBody)
                if (!data) return
                if (message.type === 'live-chat') {
                    const timeUntilNextRequest = parseFloat(FindObjectByKeyRecursively(data as Response, 'timeoutMs')) || DefaultChatRequestInterval
                    const currentPlayerTime = getCurrentPlayerTime()
                    actions = [...(FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.LiveAction[] || actions)]
                        // .map((action, i, arr) => Object.assign(action, { videoOffsetTimeMsec: (i + 1) * (timeUntilNextRequest / arr.length) }))
                        .map((action, i, arr) => Object.assign(action, { videoOffsetTimeMsec: currentPlayerTime + i * (timeUntilNextRequest / arr.length) }))

                } else if (message.type === 'replay-live-chat') {
                    const replayActions = FindObjectByKeyRecursively(data as Response, 'actions') as YTLiveChat.ReplayLiveAction[] || actions
                    if (!replayActions || replayActions.length === 0) return
                    actions = replayActions
                        .filter(replayAction => replayAction.replayChatItemAction)
                        .map(replayAction => replayAction.replayChatItemAction)
                        .map(({ actions: liveActions, videoOffsetTimeMsec }) => { return { ...liveActions[0], videoOffsetTimeMsec: parseFloat(videoOffsetTimeMsec) || 0 } })
                }
                setChatActions(
                    createAdvanceChatLiveActions(filterChatActionsWithUndefinedValue(actions), pageId)
                )
            } catch (error) {
                console.error(error)
                return
            }
        }

        chrome.runtime.onMessage.addListener(WebRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(WebRequestListener)
        }
    }, [pageId])

    return { chatActions, pageType }
}
