
export interface ChatLiveActionWithVideoOffsetTime extends YTLiveChat.LiveAction {
    videoOffsetTimeMsec: number
}
export interface AdvancedChatLiveAction extends ChatLiveActionWithVideoOffsetTime {
    uuid: string
    pageId: string,
    timeUntilNextRequest: number
}
// export type AdvancedChatLiveAction = AdvancedChatLiveAction
export type AdvancedChatLiveActions = AdvancedChatLiveAction[]
