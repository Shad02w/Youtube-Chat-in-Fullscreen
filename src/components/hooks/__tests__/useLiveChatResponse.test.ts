import { cleanupWindowMessages, setupChrome, setupWindowMessage } from "@/jest-setup"
import { useLiveChatResponse } from "@hooks/useLiveChatResponse"
import { CatchedLiveChatRequestMessage } from "@models/Request"
import { act } from "@testing-library/react"
import { renderHook, cleanup } from "@testing-library/react-hooks"
import { chrome } from "jest-chrome"
import axios from 'axios'
import { LiveChatResponse } from "@models/Fetch"

declare const global: { chrome: typeof chrome }
describe('useLiveChatResponse hook testing', () => {
    beforeAll(() => {
        setupChrome()
        setupWindowMessage()
    })

    afterEach(() => {
        cleanupWindowMessages()
        jest.clearAllMocks()
        jest.restoreAllMocks()
        cleanup()
    })

    test('Should not call effect callback when it is not init page type in background message', () => {
        const effectMockFn = jest.fn()
        renderHook(() => useLiveChatResponse(effectMockFn))
        expect(effectMockFn).toBeCalledTimes(0)
        act(() => {
            const message = { type: 'init-live-chat', details: { url: 'url' } } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })
        expect(effectMockFn).toBeCalledTimes(0)
    })

    test('Should not call effect callback when pageType is normal in messages', () => {
        const effectMockFn = jest.fn()
        renderHook(() => useLiveChatResponse(effectMockFn))
        expect(effectMockFn).toBeCalledTimes(0)
        act(() => {
            const message = { type: 'normal', details: {} } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })
        expect(effectMockFn).toBeCalledTimes(0)
    })


    test('Should not call effect callback when fetched response is undefined', () => {
        jest.spyOn(console, 'error').mockImplementationOnce(e => e)
        jest.spyOn(axios, 'get').mockRejectedValueOnce('name')

        const effectMockFn = jest.fn()
        renderHook(() => useLiveChatResponse(effectMockFn))
        expect(effectMockFn).toBeCalledTimes(0)
        act(() => {
            const message = { type: 'live-chat', details: { url: 'url' } } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })
        expect(effectMockFn).toBeCalledTimes(0)
    })

    test('Should call effect callback when response is fetched', async () => {
        const response = { name: 'ytf' } as LiveChatResponse
        jest.spyOn(console, 'error').mockImplementationOnce(e => e)
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { ...response } })

        const effectMockFn = jest.fn()
        renderHook(() => useLiveChatResponse(effectMockFn))
        expect(effectMockFn).toBeCalledTimes(0)
        await act(async () => {
            const message = { type: 'live-chat', details: { url: 'url' } } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })

        expect(effectMockFn).toBeCalledTimes(1)
        expect(effectMockFn).toBeCalledWith(response, 'live-chat')
    })
})