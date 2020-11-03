import { useEffect, useRef, useState, useCallback } from 'react'
import { AdvancedChatLiveActions, LiveChatResponse2LiveChatReplayActions } from '../../models/Chat'
import { FetchData } from '../../models/Fetch'
import { CatchedLiveChatRequestMessage, PageType } from '../../models/Request'
import { ContentScriptWindow } from '../../models/Window'
import { debounce } from '../../models/Function'
import { InterceptedDataElementId_InitLiveChat, InitLiveChatRequestAction } from '../../models/Intercept'


declare const window: ContentScriptWindow

export type LiveChatEffectCallback = (actions: AdvancedChatLiveActions, pageType: PageType) => any

export const useLiveChatReplayEffect = (callback: LiveChatEffectCallback) => {


    useEffect(() => {
        const messagesListener = async (message: CatchedLiveChatRequestMessage) => {
            const { type, details: { url }, requestBody, requestHeaders } = message
            if (type !== 'replay-live-chat') return
            const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
            if (!liveChatResponse) return
            callback(
                LiveChatResponse2LiveChatReplayActions(liveChatResponse),
                type)
        }
        chrome.runtime.onMessage.addListener(messagesListener)
        return () => chrome.runtime.onMessage.removeListener(messagesListener)

    }, [callback])
}


export const useInitLiveChatReplayEffect = (callback: LiveChatEffectCallback) => {

    const [init, setInit] = useState(false)
    const initRef = useRef(false)
    initRef.current = init

    const requestInitLiveChatData = debounce(1500, () => {
        if (!initRef.current) return
        setInit(false)
        const InterceptObserver = new MutationObserver(() => {
            const interceptEl = document.getElementById(InterceptedDataElementId_InitLiveChat)
            if (!interceptEl) return
            const json: InitLiveChatRequestAction = {
                type: 'REQUEST'
            }
            interceptEl.innerText = JSON.stringify(json)
            InterceptObserver.disconnect()
        })
        InterceptObserver.observe(document.body, { childList: true, subtree: true })
    })

    // listen for poped cached message
    useEffect(() => {
        const messageListener = ((event: CustomEvent<CatchedLiveChatRequestMessage>) => {
            const { details: { }, type } = event.detail
            if (type !== 'init-replay-live-chat') return
            requestInitLiveChatData()
        }) as EventListener
        window.messages.addEventListener('release', messageListener)
        return () => window.messages.removeEventListener('release', messageListener)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const messagesListener = (message: CatchedLiveChatRequestMessage) => {
            const { type } = message
            if (type !== 'init-replay-live-chat') return
        }


    }, [])
}