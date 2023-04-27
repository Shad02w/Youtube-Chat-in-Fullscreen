import { LiveChatResponse } from '@models/Fetch'
import { debounce } from '@models/Function'
import { PostMessageType } from '@models/PostMessage'
import { PageType } from '@models/Request'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useBackgroundMessage } from './useBackgroundMessage'

type InitLiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const requestInitLiveChatData_debounce_time = 1500

const requestInitLiveChatData_postMessage = () => {
    const requestMessage: PostMessageType = {
        type: 'request'
    }
    window.postMessage(requestMessage, '*')
}

export const useInitLiveChatResponse = (effect: InitLiveChatResponseEffectCallback) => {
    const [pageType, setPageType] = useState<PageType | undefined>(undefined)
    const [initResponse, setInitResponse] = useState<LiveChatResponse | undefined>(undefined)
    const pageTypeRef = useRef(pageType)
    const effectRef = useRef(effect)
    pageTypeRef.current = pageType
    effectRef.current = effect

    const requestInitLiveChatData = useCallback(debounce(requestInitLiveChatData_debounce_time, requestInitLiveChatData_postMessage), [])

    useEffect(() => {
        const messageListener = (event: MessageEvent<PostMessageType>) => {
            if (!event.data || !event.type || event.data.type !== 'response' || !event.data.response) return
            setInitResponse(event.data.response)
        }
        window.addEventListener('message', messageListener)
        return () => window.removeEventListener('message', messageListener)
    }, [])

    useBackgroundMessage(message => {
        const { type } = message
        if (type === 'init-live-chat' || type === 'init-replay-live-chat') {
            setPageType(type)
            requestInitLiveChatData()
        }
    })

    useEffect(() => {
        if (!pageTypeRef.current || !initResponse) return
        effectRef.current(initResponse, pageTypeRef.current)
    }, [initResponse])
}
