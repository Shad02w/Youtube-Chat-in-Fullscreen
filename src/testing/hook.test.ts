import { useBackgroundMessageEffect } from '@hooks/useBackgroundMessageEffect'
import { Messages } from '@models/Event'
import { CatchedLiveChatRequestMessage } from '@models/Request'
import { ContentScriptWindow } from '@models/Window'
import { renderHook, act } from '@testing-library/react-hooks'
import chrome from 'sinon-chrome'

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }

describe('useBackgroundMessageEffect hook', () => {

    beforeAll(() => {
        Object.defineProperty(window, 'messages', {
            value: new Messages([]),
            writable: true,
        })
        Object.assign(global, { chrome })
    })

    beforeAll(() => {
        window.messages = new Messages([])
    })

    test('call effect callback when cached messages is released', () => {
        const effectFunction = jest.fn().mockImplementation(d => d)
        const message = { details: { frameId: 1 } } as CatchedLiveChatRequestMessage
        renderHook(() => useBackgroundMessageEffect(effectFunction))

        act(() => {
            window.messages.add(message)
            window.messages.pop()
        })

        expect(effectFunction.mock.calls[0][0]).toStrictEqual(message)
        expect(effectFunction.mock.results[0].value).toStrictEqual(message)
    })

})
