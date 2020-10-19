import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { AdvancedChatLiveActions, getLiveChatReplayActions, getLiveChatActions } from '../../models/Chat'
import { CatchedLiveChatRequestMessage, PageType } from '../../models/Request'
import { FetchData } from '../../models/Fetch'
import { ContentScriptWindow } from '../../models/Window'
import { useInterceptElementState } from './useElementState'
import { InterceptedDataElementId_InitLiveChat, InitLiveChatRequestAction } from '../../models/Intercept'
import { FindObjectByKeyRecursively } from '../../models/Function'

declare const window: ContentScriptWindow

export const useChatActions = (init: AdvancedChatLiveActions, max: number) => {
    const [chatActions, setChatActioins] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatActioins(pre => pre.concat(list).slice(-max)), [setChatActioins, max])

    const reset = useCallback(() => setChatActioins([]), [setChatActioins])

    return { chatActions, update, reset }
}

export const useFetchedLiveChatData = () => {
    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const [pageType, setPageType] = useState<PageType>('normal')

    const pageTypeRef = useRef(pageType)
    pageTypeRef.current = pageType

    const { data: initLiveChatRequestAction } = useInterceptElementState<InitLiveChatRequestAction>({
        type: 'UPDATE',
        dataString: JSON.stringify({}),
    }, InterceptedDataElementId_InitLiveChat)

    const requestInitLiveChatData = () => {
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
    }

    // flush the message from background which cached when react app is not ready
    useEffect(() => {
        if (window.ready) return
        window.ready = true
        for (const message of window.messageQueue) {
            const { type } = message
            if (type !== 'init-live-chat' && type !== 'init-replay-live-chat') continue
            requestInitLiveChatData()
            setPageType(type)
        }
    }, [])

    useEffect(() => {
        if (!initLiveChatRequestAction || !initLiveChatRequestAction.type || initLiveChatRequestAction.type !== 'UPDATE') return
        const { dataString } = initLiveChatRequestAction
        const type = pageTypeRef.current
        console.log('init', type)
        try {
            const response = JSON.parse(dataString)
            if (type === 'init-live-chat' || type === 'live-chat') {
                const actions = getLiveChatActions(response)
                console.log('init actions', actions, type)
                setChatActions(actions)
            } else if (type === 'init-replay-live-chat' || type === 'replay-live-chat') {
                const actions = getLiveChatReplayActions(response)
                console.log('init replay actions', actions, type)
                setChatActions(actions)
            }
        } catch (error) {
            console.error(error)
        }
    }, [initLiveChatRequestAction])

    useEffect(() => {

        const WebRequestListener = async (message: CatchedLiveChatRequestMessage) => {
            setPageType(message.type)
            if (message.type === 'normal') return
            const { details: { url }, requestBody, requestHeaders, type } = message
            try {
                // const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                if (type === 'init-live-chat' || type === 'init-replay-live-chat') {
                    console.log(message)
                    requestInitLiveChatData()
                }
                else if (message.type === 'live-chat') {
                    const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                    if (!liveChatResponse) return
                    setChatActions(getLiveChatActions(liveChatResponse))
                }
                else if (message.type === 'replay-live-chat') {
                    const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                    if (!liveChatResponse) return
                    setChatActions(getLiveChatReplayActions(liveChatResponse))
                }
            } catch (error) {
                console.error(error)
                return
            }
        }

        chrome.runtime.onMessage.addListener(WebRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(WebRequestListener)
        }
    }, [])

    const chatActionsMemo = useMemo(() => chatActions, [chatActions])

    return { chatActions: chatActionsMemo, pageType }
}
