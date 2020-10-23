import { Messages } from "./Event";

export interface ContentScriptWindow extends Window {
    injectHasRun: boolean,
    ready: boolean
    messages: Messages
}



