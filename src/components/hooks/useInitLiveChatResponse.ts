import { LiveChatResponse } from "@models/Fetch";
import { PostMessageType } from "@models/PostMessage";
import { PageType } from "@models/Request";
import { useEffect, useRef, useState, useCallback } from "react";
import { useBackgroundMessage } from "@hooks/useBackgroundMessage";

type InitLiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const useInitLiveChatResponse = (effect: InitLiveChatResponseEffectCallback) => {

    const [pageType, setPageType] = useState<PageType | undefined>(undefined)
    const [initResponse, setInitResponse] = useState<LiveChatResponse | undefined>(undefined)
    const effectRef = useRef(effect)
    effectRef.current = effect
    const pageTypeRef = useRef(pageType)
    pageTypeRef.current = pageType

    /**
     * Request embedding page to get init chat data in chat iframe
     */
    const request = useCallback(() => {
        console.log('request callback in content script')
        const requestMessage: PostMessageType = { type: 'request' }
        window.postMessage(requestMessage, '*', undefined)
    }, [])

    useBackgroundMessage(message => {
        const { type } = message
        if (type === 'init-live-chat' || type === 'init-replay-live-chat') {
            setPageType(type)
            // request when iframe is created
            request()
        }
    })

    /**
     * Listen for embedding page response of init chat data
     */
    useEffect(() => {
        const messageListener = (event: MessageEvent<PostMessageType>) => {
            if (event.source !== window) return
            const message = event.data
            if (message.type !== 'response') return
            console.log('response', message.data)
            setInitResponse(message.data)
        }
        window.addEventListener('message', messageListener)
        return () => window.removeEventListener('message', messageListener)
    }, [])



    useEffect(() => {
        if (!initResponse || !pageTypeRef.current) return
        effectRef.current(initResponse, pageTypeRef.current)
    }, [initResponse])
}
