import { useState, useCallback } from 'react'
import {
    AdvancedChatLiveActions,
} from '@models/Chat'
import { ContentScriptWindow } from '@models/Window'

declare const window: ContentScriptWindow

export const useChatActions = (init: AdvancedChatLiveActions, max: number) => {
    const [chatActions, setChatActioins] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatActioins(pre => pre.concat(list).slice(-max)), [setChatActioins, max])

    const reset = useCallback(() => setChatActioins([]), [setChatActioins])

    return { chatActions, update, reset }
}
