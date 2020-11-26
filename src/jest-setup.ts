import { ContentScriptWindow } from "@models/Window"
import { Messages } from '@models/Event';
import { chrome } from 'jest-chrome';
import { ChatBoxId, ChatFrameId } from "@models/ChatBox";

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }

export const liveChatUrl = 'https://www.youtube.com/live_chat?continuation=0ofMyANmGlBDamdLRFFvTFgwdE'
export const replayLiveChatUrl = 'https://www.youtube.com/live_chat_replay?continuation=0ofMyANmGlBDamdLRFFvTFgwdE'

export const setupWindowMessage = () => {
    Object.defineProperty(window, 'messages', {
        writable: true,
        value: new Messages([])

    })
}

export const cleanupWindowMessages = () => {
    window.messages = new Messages([])
}

export const setupChrome = () => {
    Object.defineProperty(global, 'chrome', {
        value: chrome
    })
}


export const createChatBox = (data: Object) => {
    const jsonString = JSON.stringify(data)
    const chatbox = document.createElement('ytd-live-chat-frame')
    chatbox.id = ChatBoxId
    const iframe = document.createElement('iframe')
    iframe.id = ChatFrameId
    iframe.src = liveChatUrl
    iframe.classList.add('ytd-live-chat-frame')

    const scriptTextContent = 'window["ytInitialData"]=' + jsonString

    const script = document.createElement('script')
    script.textContent = scriptTextContent
    chatbox.appendChild(iframe)
    return { chatbox, iframe, script, scriptTextContent }
}
