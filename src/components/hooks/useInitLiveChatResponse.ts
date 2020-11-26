import { LiveChatResponse } from "@models/Fetch";
import { PageType } from "@models/Request";
import { useEffect, useRef, useState } from "react";
import { useBackgroundMessage } from "./useBackgroundMessage";
import { useChatFrame } from "./useChatFrame";

type InitLiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const useInitLiveChatResponse = (effect: InitLiveChatResponseEffectCallback) => {

    const { initResponse } = useChatFrame()
    const [pageType, setPageType] = useState<PageType | undefined>(undefined)
    const effectRef = useRef(effect)
    effectRef.current = effect
    const pageTypeRef = useRef(pageType)
    pageTypeRef.current = pageType

    useBackgroundMessage(message => {
        const { type } = message
        if (type === 'init-live-chat' || type === 'init-replay-live-chat') {
            setPageType(type)
        }
    })

    useEffect(() => {
        if (!initResponse || !pageTypeRef.current) return
        effectRef.current(initResponse, pageTypeRef.current)
    }, [initResponse])
}
