import { AdvancedChatLiveActions, LiveChatResponse2LiveChatActions, LiveChatResponse2LiveChatReplayActions } from "@models/Chat"
import { LiveChatResponse } from "@models/Fetch"
import { PageType } from "@models/Request"
import { useState } from "react"
import { useLiveChatResponse } from "@hooks/useLiveChatResponse"
import { useInitLiveChatResponse } from "./useInitLiveChatResponse"

export const useLiveChatActions = () => {

    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const [pageType, setPageType] = useState<PageType>('normal')
    const response2LiveChatActions = (response: LiveChatResponse, type: PageType) => {
        setPageType(type)
        if (type === 'init-live-chat' || type === 'live-chat') {
            const actions = LiveChatResponse2LiveChatActions(response)
            setChatActions(actions)
        } else {
            const actions = LiveChatResponse2LiveChatReplayActions(response)
            setChatActions(actions)
        }
    }

    useInitLiveChatResponse((res, p) => response2LiveChatActions(res, p))
    useLiveChatResponse((res, p) => response2LiveChatActions(res, p))

    return { chatActions, pageType }
}