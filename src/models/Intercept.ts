import { YTPlayerState } from '@models/Player'
import { JSON2Datastring, Datastring2JSON } from '@models/Datastring'

export const InterceptedDataElementId_PlayerState = '__Intercepted_data_element_id_yt_player'

export interface PlayerStateData {
    state: YTPlayerState
}
export interface InterceptElement<T> {
    element: HTMLElement
    mount(): void
    set(data: T): void
    get(): T
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

export const setInterceptElementContent = <T>(content: T, el: HTMLElement) => (el.textContent = JSON2Datastring(content))
export const getInterceptElementContent = <T>(el: HTMLElement): T => Datastring2JSON(el.textContent!)
export const mountInterceptElement = (el: HTMLElement) => document.body.appendChild(el)
