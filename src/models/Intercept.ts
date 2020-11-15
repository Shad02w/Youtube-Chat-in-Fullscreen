import { YTPlayerState } from '@models/Player'
import base64 from 'base-64';

export const InterceptedDataElementId_PlayerState = '__Intercepted_data_element_id_yt_player'
export const InterceptedDataElementId_InitLiveChat = '__Intercepted_data_element_id_init_live_chat'

export interface PlayerStateData {
    state: YTPlayerState
}
export type InitLiveChatRequestAction =
    {
        type: 'REQUEST',
    }
    | {
        type: 'UPDATE',
        dataString: string,
    }

export interface InterceptElement<T> {
    element: HTMLElement
    mount(): void
    set(data: T): void
    get(): T,
}



export const createInterceptElement = <T>(id: string, initValue: T): InterceptElement<T> => {
    const interceptedElement = document.createElement('div')
    const testId = `intercept-${id}`
    interceptedElement.id = id
    interceptedElement.classList.add('_youtube-chat-in-fullscreen-intercept')
    interceptedElement.setAttribute('data-testid', testId)
    setInterceptElementContent(initValue, interceptedElement)


    return {
        element: interceptedElement,
        mount: () => mountInterceptElement(interceptedElement),
        set: (data: T) => setInterceptElementContent(data, interceptedElement),
        get: () => getInterceptElementContent<T>(interceptedElement),
    }
}


export const setInterceptElementContent = <T>(content: T, el: HTMLElement) => el.textContent = base64.encode(JSON.stringify(content))
export const getInterceptElementContent = <T>(el: HTMLElement): T => JSON.parse(base64.decode(el.textContent!))
export const mountInterceptElement = (el: HTMLElement) => document.body.appendChild(el)