import { useBackgroundMessage } from '@hooks/useBackgroundMessage'
import { Messages } from '@models/Event'
import { CaughtLiveChatRequestMessage } from '@models/Request'
import { ContentScriptWindow } from '@models/Window'
import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import { chrome } from 'jest-chrome'

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }

describe('useBackgroundMessageEffect hook', () => {
    Object.defineProperty(global, 'chrome', { value: chrome })
    Object.defineProperty(window, 'messages', {
        value: new Messages([]),
        writable: true
    })

    beforeEach(() => {
        window.messages = new Messages([])
    })

    afterEach(async () => {
        await cleanup()
    })

    test('Should call effect callback when cached messages is released', () => {
        const effectFunction = jest.fn().mockImplementation(d => d)
        const message = { details: { frameId: 1 } } as CaughtLiveChatRequestMessage
        renderHook(() => useBackgroundMessage(effectFunction))

        act(() => {
            window.messages.add(message)
            window.messages.pop()
        })
        expect(effectFunction.mock.calls[0][0]).toStrictEqual(message)
        expect(effectFunction.mock.results[0].value).toStrictEqual(message)
    })

    test('Should call effect callback when message from background script is released', () => {
        const effectFunction = jest.fn()
        const message = { message: 'hello' }
        renderHook(() => useBackgroundMessage(effectFunction))

        act(() => {
            chrome.runtime.onMessage.callListeners(message, {}, () => {
                /** no content */
            })
        })

        expect(effectFunction).toBeCalled()
    })
})
