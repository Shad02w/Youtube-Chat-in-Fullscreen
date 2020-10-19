import { CatchedLiveChatRequestMessage } from "./Request";

export interface ContentScriptWindow extends Window {
    injectHasRun: boolean,
    messageQueue: CatchedLiveChatRequestMessage[]
    ready: boolean
    ytInitialData: YTLiveChat.Response,
    myInitialData: YTLiveChat.Response
}



