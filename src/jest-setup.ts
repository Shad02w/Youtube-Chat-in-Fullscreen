import { ContentScriptWindow } from '@models/Window'
import { Messages } from '@models/Event'
import { chrome } from 'jest-chrome'

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }

export const setupWindowMessage = () => {
    Object.defineProperty(window, 'messages', {
        writable: true,
        value: new Messages([]),
    })
}

export const cleanupWindowMessages = () => {
    window.messages = new Messages([])
}

export const setupChrome = () => {
    Object.defineProperty(global, 'chrome', {
        value: chrome,
    })
}
