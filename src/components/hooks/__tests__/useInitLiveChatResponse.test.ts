import { renderHook, act, cleanup } from "@testing-library/react-hooks"
import { initLiveChatRequestAction_Default, requestInitLiveChatData, requestInitLiveChatData_debounce_time, useInitLiveChatResponse } from '@hooks/useInitLiveChatResponse';
import { ContentScriptWindow } from "@models/Window";
import { cleanupWindowMessages, setupChrome, setupWindowMessage } from "@/jest-setup";
import { createInterceptElement, getInterceptElementContent, InitLiveChatRequestAction, InterceptedDataElementId_InitLiveChat } from "@models/Intercept";
import { chrome } from 'jest-chrome';
import { CatchedLiveChatRequestMessage } from "@models/Request";
import { waitFor } from "@testing-library/dom";

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }

describe('requestInitLiveChatData testing', () => {
    expect(requestInitLiveChatData()).toBeUndefined()
})

describe('useInitLiveChatResponse custom effect hook testing', () => {

    const updateAction: InitLiveChatRequestAction = { type: 'UPDATE', dataString: JSON.stringify({ messages: 'hello' }) }
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


    test('Should run effect callback with default value and "normal" page type, when intercepte element does not exist', () => {
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(1)
        if (initLiveChatRequestAction_Default.type === 'UPDATE')
            expect(mockFn).toBeCalledWith(JSON.parse(initLiveChatRequestAction_Default.dataString), 'normal')
    })

    test('Should run effect callback with parameter according to intercept element, when intercepte element created before hook', () => {
        const interceptEl = createInterceptElement(InterceptedDataElementId_InitLiveChat, updateAction)
        interceptEl.mount()

        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(1)
        if (initLiveChatRequestAction_Default.type === 'UPDATE')
            expect(mockFn).toBeCalledWith(JSON.parse(updateAction.dataString), 'normal')
    })


    test('Should change intercept element to request action after getting the background message of init live chat', async () => {
        const message = { type: 'init-live-chat', details: { frameId: 0 } } as CatchedLiveChatRequestMessage
        const interceptEl = createInterceptElement(InterceptedDataElementId_InitLiveChat, updateAction)
        interceptEl.mount()
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(1)

        await act(async () => {
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
            jest.runAllTimers()
        })

        expect(getInterceptElementContent(interceptEl.element)).toStrictEqual({ type: 'REQUEST' })

        const updateAction2Message = { message: 'bye111111111111' }
        const updateAction2: InitLiveChatRequestAction = { type: 'UPDATE', dataString: JSON.stringify(updateAction2Message) }
        await act(async () => {
            interceptEl.set(updateAction2)
        })
        expect(getInterceptElementContent(interceptEl.element)).toStrictEqual(updateAction2)
    })

    test('Shuld not call effect when the page type is not "init" in background message', async () => {
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(1)
        const message = { type: 'live-chat' } as CatchedLiveChatRequestMessage
        await act(async () => chrome.runtime.onMessage.callListeners(message, {}, () => { }))
        expect(mockFn).toBeCalledTimes(1)
    })

    test('Should console a error message when the datastring in intercept element is not valid JSON', async () => {
        const interceptEl = createInterceptElement(InterceptedDataElementId_InitLiveChat, updateAction)

        const consoleMockFn = jest.fn()
        const effectMockFn = jest.fn()
        jest.spyOn(console, 'error').mockImplementationOnce(consoleMockFn)
        interceptEl.mount()
        renderHook(() => useInitLiveChatResponse(effectMockFn))
        expect(effectMockFn).toBeCalledTimes(1)
        expect(effectMockFn).toBeCalledWith(JSON.parse(updateAction.dataString), 'normal')
        await act(async () => interceptEl.set({ type: 'UPDATE', dataString: 'abc' }))

        expect(consoleMockFn).toBeCalledTimes(1)
        expect(effectMockFn).toBeCalledTimes(1)
    })


})