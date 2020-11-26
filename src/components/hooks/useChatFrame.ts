import { getChatBoxIframeScript, getLiveChatReponseFromWindowObjectString } from "@models/ChatBox"
import { LiveChatResponse } from "@models/Fetch"
import { useCallback, useEffect, useState } from "react"
import { useElementState } from "./useElementState"


export const useChatFrame = () => {
    const { ready, node } = useElementState(getChatBoxIframeScript)

    const [initResponse, setInitResponse] = useState<LiveChatResponse | undefined>(undefined)

    const update = useCallback((text: string | null) => {
        if (!text) return
        setInitResponse(getLiveChatReponseFromWindowObjectString(text))
    }, [setInitResponse])

    const reset = useCallback(() => {
        setInitResponse(undefined)
    }, [setInitResponse])

    useEffect(() => {
        if (ready && node) {
            const script = node as HTMLScriptElement
            update(script.textContent)
            const observer = new MutationObserver(() => {
                console.log('text', script.textContent)
                update(script.textContent)
            })
            observer.observe(node, { childList: true })
            return () => observer.disconnect()
        } else {
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node, ready, update, reset])

    return { ready, initResponse }
}
