import { LiveChatResponse, } from './Fetch'
import { v4 as uuidV4 } from 'uuid'
import { FindObjectByKeyRecursively } from './Function'
import { getCurrentPlayerTime } from './Player'

export interface ChatLiveActionWithVideoOffsetTime extends YTLiveChat.LiveAction {
    // use in live chat
    videoOffsetTimeMsec: number

}
export interface AdvancedChatLiveAction extends ChatLiveActionWithVideoOffsetTime {
    uuid: string
}
// export type AdvancedChatLiveAction = AdvancedChatLiveAction
export type AdvancedChatLiveActions = AdvancedChatLiveAction[]


const DefaultChatRequestInterval = 5000

function filterChatActionsWithUndefinedValue(chatActions: ChatLiveActionWithVideoOffsetTime[]): ChatLiveActionWithVideoOffsetTime[] {
    return chatActions.filter(action => action.addChatItemAction && action.addChatItemAction.item)
        .filter(({ addChatItemAction }) => addChatItemAction!.item.liveChatTextMessageRenderer
            || addChatItemAction!.item.liveChatPaidMessageRenderer
            || addChatItemAction!.item.liveChatMembershipItemRenderer)
}

function createAdvanceChatLiveActions(chatActions: ChatLiveActionWithVideoOffsetTime[]): AdvancedChatLiveActions {
    return chatActions.map((action): AdvancedChatLiveAction => ({
        ...action,
        uuid: uuidV4(),
    }))
}

export const EqualAdvancedChatLiveActions = (a: AdvancedChatLiveActions, b: AdvancedChatLiveActions): boolean => {
    if (a.length === 0 || b.length === 0) return false
    if (a[0].uuid === b[0].uuid) return true
    else return false
}



export const LiveChatResponse2LiveChatActions = (response: LiveChatResponse): AdvancedChatLiveActions => {
    const timeUntilNextRequest = parseFloat(FindObjectByKeyRecursively(response as Response, 'timeoutMs')) || DefaultChatRequestInterval
    const currentPlayerTime = getCurrentPlayerTime()
    const actions = [...(FindObjectByKeyRecursively(response as Response, 'actions') as YTLiveChat.LiveAction[] || [])]
        .map((action, i, arr) => Object.assign(action, { videoOffsetTimeMsec: currentPlayerTime + i * (timeUntilNextRequest / arr.length) }))

    return createAdvanceChatLiveActions(filterChatActionsWithUndefinedValue(actions))
}

export const LiveChatResponse2LiveChatReplayActions = (response: LiveChatResponse): AdvancedChatLiveActions => {
    const replayActions = FindObjectByKeyRecursively(response as Response, 'actions') as YTLiveChat.ReplayLiveAction[] || []
    const actions = replayActions
        .filter(replayAction => replayAction.replayChatItemAction)
        .map(replayAction => replayAction.replayChatItemAction)
        .map(({ actions: liveActions, videoOffsetTimeMsec }) => { return { ...liveActions[0], videoOffsetTimeMsec: parseFloat(videoOffsetTimeMsec) || 0 } })

    return createAdvanceChatLiveActions(filterChatActionsWithUndefinedValue(actions))
}

export const InstantAdvancedChatLiveActions = (actions: AdvancedChatLiveActions) => actions.map(action => ({ ...action, videoOffsetTimeMsec: 0 }))

export const FilterDuplicateChatAdvancedChatLiveActions = (actions: AdvancedChatLiveActions): AdvancedChatLiveActions => {

    let ids: string[] = []
    return actions.filter(({ addChatItemAction }) => {
        if (!addChatItemAction) return false
        let id: string | undefined = undefined
        const { item } = addChatItemAction
        if (item.liveChatTextMessageRenderer)
            id = item.liveChatTextMessageRenderer.id
        else if (item.liveChatPaidMessageRenderer)
            id = item.liveChatPaidMessageRenderer.id
        else if (item.liveChatMembershipItemRenderer)
            id = item.liveChatMembershipItemRenderer.id
        if (!id) return false
        if (ids.some(i => i === id)) return false
        ids.push(id)
        ids = Array.from(new Set(ids))
        return true
    })
}
