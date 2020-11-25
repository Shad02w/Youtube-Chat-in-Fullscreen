import { getChatBoxIframe, getChatBoxIframeScript } from "@models/ChatBox"
import { useEffect, useState } from "react"
import { useElementState } from "./useElementState"


export const useChatFrame = () => {
    // const getChatFrame = () => Array.from(document.getElementsByTagName('iframe')).find(el => el.id === 'chatframe')
    const { ready: chatIFrameReady, node: chatIframe } = useElementState(getChatBoxIframe)
    const { ready: chatIFrameScriptReady, node: chatIFrameScript } = useElementState(getChatBoxIframeScript)


    const [src, setSrc] = useState<string | undefined>(undefined)
    const [initResponse, setInitResponse] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (chatIFrameReady && chatIframe) {
            const iframeElement = chatIframe as HTMLIFrameElement

            setSrc(iframeElement?.src)
            const observer = new MutationObserver(() => {
                if (iframeElement?.src)
                    setSrc(iframeElement.src)
            })
            observer.observe(chatIframe, { attributes: true, attributeFilter: ['src'] })
            return () => observer.disconnect()
        } else {
            setSrc(undefined)
        }
    }, [chatIFrameReady, chatIframe])

    useEffect(() => {
        if (chatIFrameScriptReady && chatIFrameScript) {
            const script = chatIFrameScript as HTMLScriptElement
            setInitResponse(script.textContent ? script.textContent : undefined)
            const observer = new MutationObserver(() => {
                setInitResponse(script.textContent ? script.textContent : undefined)
            })
            observer.observe(chatIFrameScript, { childList: true })
            return () => observer.disconnect()
        } else {
            setInitResponse(undefined)
        }
    }, [chatIFrameScriptReady, chatIFrameScript])

    return { src, initResponse }
}
