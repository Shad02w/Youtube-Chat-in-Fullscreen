import { ChatBoxCollapsedAttributeName, getChatBoxElement, isChatBoxExpanded } from "@models/ChatBox"
import { useEffect, useState } from "react"
import { useElementState } from "./useElementState"

export const useChatBox = () => {
    const [expanded, setExpanded] = useState<boolean | undefined>(isChatBoxExpanded())
    const { ready, node } = useElementState(getChatBoxElement)
    const chatBoxElement = node as HTMLElement

    useEffect(() => {
        if (ready && chatBoxElement) {
            const chatBoxObserver = new MutationObserver(mutations => {
                if (mutations.find(m => m.type === 'attributes')) {
                    setExpanded(isChatBoxExpanded())
                }
            })
            chatBoxObserver.observe(chatBoxElement, { attributes: true, attributeFilter: [ChatBoxCollapsedAttributeName] })
            return () => {
                chatBoxObserver.disconnect()
                setExpanded(undefined)
            }
        }
    }, [ready, chatBoxElement])


    return { ready, expanded }
}
