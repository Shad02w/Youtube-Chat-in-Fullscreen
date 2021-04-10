import { useState, useCallback } from 'react'
import { AdvancedChatLiveActions } from '@models/Chat'

export const useChatActions = (init: AdvancedChatLiveActions, max: number) => {
    const [chatActions, setChatActions] = useState<AdvancedChatLiveActions>(init)

    const update = useCallback((list: AdvancedChatLiveActions) => setChatActions(pre => pre.concat(list).slice(-max)), [setChatActions, max])

    const reset = useCallback(() => setChatActions([]), [setChatActions])

    return { chatActions, update, reset }
}
