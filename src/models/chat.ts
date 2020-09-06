
export interface ChatLiveAction extends YTLiveChat.LiveAction {
    uuid: string
    pageId: string
    vidoOffsetTimeMsec: number
}
export type ChatAction = ChatLiveAction
export type ChatActionList = ChatAction[]