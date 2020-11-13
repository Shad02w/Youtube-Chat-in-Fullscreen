import { YTPlayerState } from '../models/Player'

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
    interceptedElement.innerHTML = JSON.stringify(initValue)
    interceptedElement.classList.add('_youtube-chat-in-fullscreen-intercept')
    interceptedElement.setAttribute('data-testid', testId)

    return {
        element: interceptedElement,
        mount: () => document.body.appendChild(interceptedElement),
        set: (data: T) => interceptedElement.innerHTML = JSON.stringify(data),
        get: () => JSON.parse(interceptedElement.innerHTML),
    }
}
