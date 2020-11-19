import { FetchData, LiveChatResponse } from '@models/Fetch';
import { PageType } from '@models/Request';
import { useBackgroundMessageEffect } from '@hooks/useBackgroundMessageEffect';

type LiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const useLiveChatResponse = (effect: LiveChatResponseEffectCallback) => {

    useBackgroundMessageEffect(async (message) => {
        if (message.type === 'init-live-chat' || message.type === 'init-replay-live-chat') return
        const { type, details: { url }, requestBody, requestHeaders } = message
        const response = await FetchData(url, requestBody, requestHeaders)
        if (!response) return
        effect(response, type)
    })
};

