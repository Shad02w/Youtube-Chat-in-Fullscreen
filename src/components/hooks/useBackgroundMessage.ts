import { useEffect } from 'react'
import { CatchedLiveChatRequestMessage } from '@models/Request'
import { ContentScriptWindow } from '@models/Window'

type CachedMessageEffectCallback = (message: CatchedLiveChatRequestMessage) => any
declare const window: ContentScriptWindow


export const useBackgroundMessage = (effect: CachedMessageEffectCallback) => {


    /**
     * Get messages from cached messaage event which cached before the react app is ready(mounted)
     */
    useEffect(() => {
        const listener = ((e: CustomEvent<CatchedLiveChatRequestMessage>) => {
            effect(e.detail)
        }) as EventListener
        window.messages.addEventListener('release', listener)
        return () => window.messages.removeEventListener('release', listener)
    }, [effect])

    /**
     * Get messages from extension message channel
     */
    useEffect(() => {
        const listener = (message: CatchedLiveChatRequestMessage) => effect(message)
        chrome.runtime.onMessage.addListener(listener)
        return () => chrome.runtime.onMessage.removeListener(listener)
    }, [effect])
}
