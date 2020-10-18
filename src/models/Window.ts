import { CatchedLiveChatRequestMessage } from "./Request";

export interface ContentScriptWindow extends Window {
    injectHasRun: boolean,
    messageQueue: CatchedLiveChatRequestMessage[]
    ready: boolean
}

export interface LiveChatIframeWindow extends Window {
    ytInitData: YTLiveChat.Response
}


