import { YTPlayerState } from '../models/Player'

export const InterceptedDataElementId_PlayerState = '__Intercepted_data_element_id_yt_player'

export interface PlayerStateData {
    state: YTPlayerState
}

export interface InterceptElement {
    element: HTMLElement
    set(data: Object): void
}

export const createInterceptElement = (id: string): InterceptElement => {
    const interceptedElement = document.createElement('div')
    interceptedElement.id = id

    return {
        element: interceptedElement,
        set(data: Object) {
            interceptedElement.innerHTML = JSON.stringify(data)
        }
    }
}
