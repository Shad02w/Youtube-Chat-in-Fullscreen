import { useState, useEffect, useCallback } from 'react'
import { AdvancedChatLiveActions, getLiveChatReplayActions, getLiveChatActions } from '../../models/Chat'
import { CatchedLiveChatRequestMessage, PageType } from '../../models/Request'
import { FetchData } from '../../models/Fetch'
import { ContentScriptWindow } from '../../models/Window'

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

    useEffect(() => {
        window.ready = true
    }, [])


    useEffect(() => {

        const WebRequestListener = async (message: CatchedLiveChatRequestMessage) => {
            setPageType(message.type)
            if (message.type === 'normal') return
            if (message.type === 'init-live-chat' || message.type === 'init-replay-live-chat') return
            const { details: { url }, requestBody, requestHeaders } = message
            try {
                const liveChatResponse = await FetchData(url, requestBody, requestHeaders)
                if (!liveChatResponse) return
                if (message.type === 'live-chat')
                    setChatActions(getLiveChatActions(liveChatResponse))
                else if (message.type === 'replay-live-chat')
                    setChatActions(getLiveChatReplayActions(liveChatResponse))
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

    return { chatActions, pageType }
}
