import {
    AdvancedChatLiveActions,
    InstantAdvancedChatLiveActions,
    LiveChatResponse2LiveChatActions,
    LiveChatResponse2LiveChatReplayActions
} from '@models/Chat'
import { LiveChatResponse } from '@models/Fetch'
import { PageType } from '@models/Request'
import { useState } from 'react'
import { useLiveChatResponse } from '@hooks/useLiveChatResponse'
import { useInitLiveChatResponse } from './useInitLiveChatResponse'

type ResponseType = 'init' | 'normal'

export const useLiveChatActions = () => {
    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const response2LiveChatActions = (response: LiveChatResponse, type: PageType, responseType: ResponseType) => {
        if (type === 'init-live-chat' || type === 'live-chat') {
            let actions = LiveChatResponse2LiveChatActions(response)
            if (responseType === 'init') actions = InstantAdvancedChatLiveActions(actions)
            setChatActions(actions)
        } else {
            const actions = LiveChatResponse2LiveChatReplayActions(response)
            setChatActions(actions)
        }
    }

    useInitLiveChatResponse((res, p) => response2LiveChatActions(res, p, 'init'))
    useLiveChatResponse((res, p) => response2LiveChatActions(res, p, 'normal'))

    return { chatActions }
}
