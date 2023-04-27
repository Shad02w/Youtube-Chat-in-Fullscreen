import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import { useInitLiveChatResponse } from '@hooks/useInitLiveChatResponse'
import { ContentScriptWindow } from '@models/Window'
import { cleanupWindowMessages, setupChrome, setupWindowMessage } from '@/jest-setup'
import { chrome } from 'jest-chrome'
import { CaughtLiveChatRequestMessage } from '@models/Request'
import { PostMessageType } from '@models/PostMessage'

declare const window: ContentScriptWindow

describe('useInitLiveChatResponse custom effect hook testing', () => {
    beforeAll(() => {
        setupWindowMessage()
        setupChrome()
    })

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        document.body.textContent = ''
        jest.useRealTimers()
        jest.clearAllMocks()
        jest.clearAllTimers()
        cleanupWindowMessages()
        cleanup()
    })

    test('Should not run effect callback if there are no init response web request captured', () => {
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(0)
    })

    test('Should run post request message when received init live chat page type message', done => {
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        const messageListener = (event: MessageEvent<PostMessageType>) => {
            expect(event.data).toStrictEqual({ type: 'request' })
            window.removeEventListener('message', messageListener)
            done()
        }
        window.addEventListener('message', messageListener)
        act(() => {
            chrome.runtime.onMessage.callListeners({ type: 'init-live-chat' } as CaughtLiveChatRequestMessage, {}, () => null)
            jest.runAllTimers()
        })
    })

    test('Should not run effect callback when pageType "normal" in message', async () => {
        const message = { type: 'normal', details: {} } as CaughtLiveChatRequestMessage
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(0)
        await act(async () => {
            chrome.runtime.onMessage.callListeners(message, {}, () => null)
            jest.runAllTimers()
        })
        expect(mockFn).toBeCalledTimes(0)
    })

    test('Should call effect callback once when page inject post a response message', async () => {
        const effectMock = jest.fn()
        const { waitFor } = renderHook(() => useInitLiveChatResponse(effectMock))
        const responseMessage: PostMessageType = { type: 'response', response: { message: 'this is init response' } }
        const webRequestMessage = { type: 'init-live-chat', details: {} } as CaughtLiveChatRequestMessage

        await act(async () => {
            chrome.runtime.onMessage.callListeners(webRequestMessage, {}, () => null)
            window.postMessage(responseMessage, '*')
            jest.runAllTimers()
        })

        waitFor(() => {
            expect(effectMock).toBeCalledTimes(1)
            expect(effectMock).toBeCalledWith(responseMessage.response, 'init-live-chat')
        })
    })

    test('Should not call effect when the page type is not "init" from background message', async () => {
        const effectFn = jest.fn()
        const { waitFor } = renderHook(() => useInitLiveChatResponse(effectFn))
        const message = { type: 'live-chat' } as CaughtLiveChatRequestMessage
        await act(async () => {
            chrome.runtime.onMessage.callListeners(message, {}, () => null)
            window.postMessage({ type: 'response', response: { message: 'hi' } } as PostMessageType, '*')
            jest.runAllTimers()
        })

        waitFor(() => {
            expect(effectFn).toBeCalledTimes(0)
        })
    })
})
