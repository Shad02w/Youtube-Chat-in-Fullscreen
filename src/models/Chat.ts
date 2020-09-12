
export interface ChatLiveActionWithVideoOffsetTime extends YTLiveChat.LiveAction {
    videoOffsetTimeMsec: number
}
export interface AdvancedChatLiveAction extends ChatLiveActionWithVideoOffsetTime {
    uuid: string
    pageId: string
}
// export type AdvancedChatLiveAction = AdvancedChatLiveAction
export type AdvancedChatLiveActions = AdvancedChatLiveAction[]
