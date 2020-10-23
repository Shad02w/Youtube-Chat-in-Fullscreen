import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { AdvancedChatLiveActions, LiveChatResponse2LiveChatReplayActions, LiveChatResponse2LiveChatActions, InstantAdvancedChatLiveActions } from '../../models/Chat'
import { CatchedLiveChatRequestMessage, PageType } from '../../models/Request'
import { FetchData } from '../../models/Fetch'
import { ContentScriptWindow } from '../../models/Window'
import { useInterceptElementState } from './useElementState'
import { InterceptedDataElementId_InitLiveChat, InitLiveChatRequestAction } from '../../models/Intercept'
import { debounce } from '../../models/Function'

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
    const [init, setInit] = useState(true)

    const pageTypeRef = useRef(pageType)
    pageTypeRef.current = pageType

    const initRef = useRef(init)
    initRef.current = init

    const { data: initLiveChatRequestAction } = useInterceptElementState<InitLiveChatRequestAction>({
        type: 'UPDATE',
        dataString: JSON.stringify({}),
    }, InterceptedDataElementId_InitLiveChat)

    const requestInitLiveChatData = useCallback(debounce(1500, () => {
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
    }), [setInit])

    useEffect(() => {
        if (pageType === 'normal') {
            setInit(true)
            setChatActions([])
        }
    }, [pageType])

    // flush the message from background which cached when react app is not ready
    useEffect(() => {
        const messsageListener = ((e: CustomEvent<CatchedLiveChatRequestMessage>) => {
            const { type } = e.detail
            if (type !== 'init-live-chat' && type !== 'init-replay-live-chat') return
            requestInitLiveChatData()
            setPageType(type)
        }) as EventListener
        window.messages.addEventListener('release', messsageListener)

        window.ready = true
        window.messages.popAll()

        return () => window.messages.removeEventListener('release', messsageListener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!initLiveChatRequestAction || !initLiveChatRequestAction.type || initLiveChatRequestAction.type !== 'UPDATE') return
        const { dataString } = initLiveChatRequestAction
        const type = pageTypeRef.current
        try {
            const response = JSON.parse(dataString)
            if (type === 'init-live-chat' || type === 'live-chat') {
                setChatActions(
                    InstantAdvancedChatLiveActions(
                        LiveChatResponse2LiveChatActions(response)))
            } else if (type === 'init-replay-live-chat' || type === 'replay-live-chat') {
                setChatActions(LiveChatResponse2LiveChatReplayActions(response))
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
                    requestInitLiveChatData()
                }
                else if (message.type === 'live-chat') {
                    if (initRef.current === true) return
                    const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                    if (!liveChatResponse) return
                    setChatActions(LiveChatResponse2LiveChatActions(liveChatResponse))
                }
                else if (message.type === 'replay-live-chat') {
                    if (initRef.current === true) return
                    const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                    if (!liveChatResponse) return
                    setChatActions(LiveChatResponse2LiveChatReplayActions(liveChatResponse))
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chatActionsMemo = useMemo(() => chatActions, [chatActions])

    return { chatActions: chatActionsMemo, pageType }
}
