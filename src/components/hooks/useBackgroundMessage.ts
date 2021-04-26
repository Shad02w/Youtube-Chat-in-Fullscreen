import { useEffect } from 'react'
import { CaughtLiveChatRequestMessage } from '@models/Request'
import { ContentScriptWindow } from '@models/Window'

type CachedMessageEffectCallback = (message: CaughtLiveChatRequestMessage) => any
declare const window: ContentScriptWindow

export const useBackgroundMessage = (effect: CachedMessageEffectCallback) => {
    useEffect(() => {
        const listener = ((e: CustomEvent<CaughtLiveChatRequestMessage>) => {
            effect(e.detail)
        }) as EventListener
        window.messages.addEventListener('release', listener)
        return () => window.messages.removeEventListener('release', listener)
    }, [effect])

    useEffect(() => {
        const listener = (message: CaughtLiveChatRequestMessage) => effect(message)
        chrome.runtime.onMessage.addListener(listener)
        return () => chrome.runtime.onMessage.removeListener(listener)
    }, [effect])
}
