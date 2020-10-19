import { YTPlayerState } from '../models/Player'
import { PageType } from './Request'

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
    toString(): string
}



export const createInterceptElement = <T>(id: string): InterceptElement<T> => {
    const interceptedElement = document.createElement('div')
    interceptedElement.id = id
    interceptedElement.innerHTML = JSON.stringify({})
    interceptedElement.classList.add('_youtube-chat-in-fullscreen-intercept')

    return {
        element: interceptedElement,
        mount: () => document.body.appendChild(interceptedElement),
        set: (data: T) => interceptedElement.innerHTML = JSON.stringify(data),
        get: () => JSON.parse(interceptedElement.innerHTML),
        toString: () => interceptedElement.innerHTML
    }
}