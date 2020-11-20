import { AdvancedChatLiveActions, LiveChatResponse2LiveChatActions, LiveChatResponse2LiveChatReplayActions } from "@models/Chat"
import { LiveChatResponse } from "@models/Fetch"
import { PageType } from "@models/Request"
import { useState } from "react"
import { useLiveChatResponse } from "@hooks/useLiveChatResponse"
import { useInitLiveChatResponse } from "./useInitLiveChatResponse"

export const useLiveChatActions = () => {

    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>([])
    const response2LiveChatActions = (response: LiveChatResponse, pageType: PageType) => {
        if (pageType === 'init-live-chat' || pageType === 'live-chat') {
            const actions = LiveChatResponse2LiveChatActions(response)
            setChatActions(actions)
        } else {
            const actions = LiveChatResponse2LiveChatReplayActions(response)
            setChatActions(actions)
        }
    }

    useInitLiveChatResponse((response, pageType) => response2LiveChatActions(response, pageType))
    useLiveChatResponse((response, pageType) => response2LiveChatActions(response, pageType))

    return { chatActions }
}