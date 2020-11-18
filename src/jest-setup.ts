import { ContentScriptWindow } from "@models/Window"
import { Messages } from '@models/Event';

declare const window: ContentScriptWindow

export const setupWindowMessage = () => {
    Object.defineProperty(window, 'messages', {
        writable: true,
        value: new Messages([])

    })
}

export const cleanupWindowMessages = () => {
    window.messages = new Messages([])
}

