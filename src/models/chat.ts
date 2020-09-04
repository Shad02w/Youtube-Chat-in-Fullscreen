
export interface ChatLiveAction extends YTLiveChat.LiveAction {
    uuid: string
    pageId: string
}
export type ChatAction = ChatLiveAction
export type ChatActionList = ChatAction[]