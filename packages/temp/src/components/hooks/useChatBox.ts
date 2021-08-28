import { getChatBoxElement, isChatBoxExpanded } from '@models/Chat'
import { useEffect, useState } from 'react'
import { useElementStatus } from './useElementState'
import { useMutation } from './useMutation'

export const useChatBox = () => {
    const { exist, target: chatBox } = useMutation(getChatBoxElement)
    const [expanded, setExpanded] = useState<boolean | undefined>(isChatBoxExpanded())

    useEffect(() => {
        if (exist && chatBox) {
            setExpanded(isChatBoxExpanded())
            const chatBoxObserver = new MutationObserver(mutations => {
                if (mutations.find(m => m.type === 'attributes')) {
                    setExpanded(isChatBoxExpanded())
                }
            })
            chatBoxObserver.observe(chatBox, { attributes: true })
            return () => chatBoxObserver.disconnect()
        } else {
            setExpanded(undefined)
        }
    }, [exist, chatBox])

    return { expanded, exist }
}
