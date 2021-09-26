import { FetchData, LiveChatResponse } from '@models/Fetch'
import { PageType } from '@models/Request'
import { useBackgroundMessage } from '@hooks/useBackgroundMessage'

type LiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const useLiveChatResponse = (effect: LiveChatResponseEffectCallback) => {
    useBackgroundMessage(async message => {
        if (message.type === 'init-live-chat' || message.type === 'init-replay-live-chat' || message.type === 'normal') return
        const {
            type,
            details: { url },
            requestBody,
            requestHeaders
        } = message
        const response = await FetchData(url, requestBody, requestHeaders)
        if (!response) return
        effect(response, type)
    })
}
