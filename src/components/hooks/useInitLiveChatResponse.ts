import { LiveChatResponse } from "@models/Fetch";
import { debounce } from "@models/Function";
import { InitLiveChatRequestAction, InterceptedDataElementId_InitLiveChat, setInterceptElementContent } from "@models/Intercept";
import { PostMessageType } from "@models/PostMessage";
import { PageType } from "@models/Request";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBackgroundMessage } from "./useBackgroundMessage";
import { useInterceptElement } from "./useInterceptElement";

type InitLiveChatResponseEffectCallback = (response: LiveChatResponse, pageType: PageType) => any
export const requestInitLiveChatData_debounce_time = 1500

export const initLiveChatRequestAction_Default: InitLiveChatRequestAction = { type: 'UPDATE', dataString: JSON.stringify({}) }
export const requestInitLiveChatData = () => {
    const interceptEl = document.getElementById(InterceptedDataElementId_InitLiveChat)
    if (!interceptEl) return undefined
    const json: InitLiveChatRequestAction = {
        type: 'REQUEST'
    }
    setInterceptElementContent(json, interceptEl)
}

const requestInitLiveChatData_postMessage = () => {
    const requestMessage: PostMessageType = {
        type: 'request'
    }
    window.postMessage(requestMessage, '*')
}


export const useInitLiveChatResponse = (effect: InitLiveChatResponseEffectCallback) => {


    const [pageType, setPageType] = useState<PageType | undefined>(undefined)
    const { data: initLiveChatRequestAction } = useInterceptElement<InitLiveChatRequestAction>(InterceptedDataElementId_InitLiveChat, initLiveChatRequestAction_Default)
    const [initResponse, setInitResponse] = useState<LiveChatResponse | undefined>(undefined)
    const pageTypeRef = useRef(pageType)
    const effectRef = useRef(effect)
    pageTypeRef.current = pageType
    effectRef.current = effect

    const initLiveChatRequestAction_Meomo = useMemo(() => initLiveChatRequestAction, [initLiveChatRequestAction])

    const requestInitLiveChatData_debounce = debounce(requestInitLiveChatData_debounce_time, requestInitLiveChatData)
    const request = useCallback(debounce(requestInitLiveChatData_debounce_time, requestInitLiveChatData_postMessage), [])

    useEffect(() => {
        const messageListener = (event: MessageEvent<PostMessageType>) => {
            if (event.source !== window
                || !event.data
                || event.data.type !== 'response'
                || !event.data.response) return
            setInitResponse(event.data.response)
        }
        window.addEventListener('message', messageListener)
        return () => window.removeEventListener('message', messageListener)
    }, [])

    useBackgroundMessage((message) => {
        const { type } = message
        if (type === 'init-live-chat' || type === 'init-replay-live-chat') {
            requestInitLiveChatData_debounce()
            setPageType(type)
            request()
        }
    })


    // useEffect(() => {
    //     const initAction = initLiveChatRequestAction_Meomo
    //     if (!initAction || !initAction.type || initAction.type !== 'UPDATE') return
    //     const { dataString } = initAction
    // esle
    //     // try {
    //     //     effectRef.current(JSON.parse(dataString), pageTypeRef.current)
    //     // } catch (error) {
    //     //     console.log('no right')
    //     //     console.error(error)
    //     // }
    // }, [initLiveChatRequestAction_Meomo])
    useEffect(() => {
        if (!pageTypeRef.current || !initResponse) return
        effectRef.current(initResponse, pageTypeRef.current)
    }, [initResponse])

}
