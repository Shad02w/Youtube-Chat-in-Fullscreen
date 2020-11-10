import { LiveChatResponse } from "@models/Fetch";
import { debounce } from "@models/Function";
import { InitLiveChatRequestAction, InterceptedDataElementId_InitLiveChat } from "@models/Intercept";
import { PageType } from "@models/Request";
import { useRef, useState } from "react";
import { useBackgroundMessageEffect } from "./useBackgroundMessageEffect";
import { useInterceptElementEffect } from "./useInterceptElementEffect";

type InitLiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any

export const useInitLiveChatResponseEffect = (effect: InitLiveChatResponseEffectCallback) => {

    const [pageType, setPageType] = useState<PageType>('normal')
    const pageTypeRef = useRef(pageType)
    pageTypeRef.current = pageType


    const requestInitLiveChatData = debounce(1500, () => {
        const interceptEl = document.getElementById(InterceptedDataElementId_InitLiveChat)
        if (!interceptEl) return
        const json: InitLiveChatRequestAction = {
            type: 'REQUEST'
        }
        interceptEl.innerText = JSON.stringify(json)
    })


    useBackgroundMessageEffect((message) => {
        const { type } = message
        if (type !== 'init-live-chat' && type !== 'init-replay-live-chat') return
        requestInitLiveChatData()
        setPageType(type)
    })

    useInterceptElementEffect<InitLiveChatRequestAction>(data => {
        if (!data.type || data.type !== 'UPDATE') return
        const { dataString } = data
        try {
            effect(JSON.parse(dataString), pageTypeRef.current)
        } catch (error) {
            console.error(error)
        }
    }, InterceptedDataElementId_InitLiveChat)


}
