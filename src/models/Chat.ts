
export interface ChatLiveActionWithVideoOffsetTime extends YTLiveChat.LiveAction {
    // use in live chat
    videoOffsetTimeMsec: number

}
export interface AdvancedChatLiveAction extends ChatLiveActionWithVideoOffsetTime {
    uuid: string
    pageId: string,
}
// export type AdvancedChatLiveAction = AdvancedChatLiveAction
export type AdvancedChatLiveActions = AdvancedChatLiveAction[]
