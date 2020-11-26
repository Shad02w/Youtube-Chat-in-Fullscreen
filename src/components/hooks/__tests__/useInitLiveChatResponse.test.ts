import { renderHook, act, cleanup } from "@testing-library/react-hooks"
import { useInitLiveChatResponse } from '@hooks/useInitLiveChatResponse';
import { ContentScriptWindow } from "@models/Window";
import { cleanupWindowMessages, createChatBox, setupChrome, setupWindowMessage } from "@/jest-setup";
import { chrome } from 'jest-chrome';
import { v4 as uuidV4 } from 'uuid'
import { LiveChatResponse } from "@models/Fetch";
import { waitFor } from "@testing-library/dom";
import { CatchedLiveChatRequestMessage } from "@models/Request";

declare const window: ContentScriptWindow
declare const global: { chrome: typeof chrome }


jest.mock('uuid', () => {
    return {
        v4: jest.fn(() => '12345')
    }
})




describe('useInitLiveChatResponse custom effect hook testing', () => {

    beforeAll(() => {
        setupWindowMessage()
        setupChrome()
    })

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(async done => {
        jest.useRealTimers()
        jest.clearAllMocks()
        jest.clearAllTimers()
        cleanupWindowMessages()
        await cleanup()
        document.body.textContent = ''
        done()
    })


    test('Should not run effect callback when chat iframe is not exist', () => {
        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        expect(mockFn).toBeCalledTimes(0)
    })

    test('Should run effect callback and return response and pageType according to chatIframe ', async () => {

        const res1 = { data: 1 } as LiveChatResponse
        // setup chat box element
        const { chatbox, iframe, script } = createChatBox(res1)
        document.body.appendChild(chatbox)
        waitFor(() => expect(iframe.contentDocument).toBeDefined())
        iframe.contentDocument!.appendChild(script)

        const mockFn = jest.fn()
        renderHook(() => useInitLiveChatResponse(mockFn))
        // only update the pageType with message should not call the callback, should wait for next update in script 
        act(() => {
            chrome.runtime.onMessage.callListeners({ type: 'init-live-chat' } as CatchedLiveChatRequestMessage, {}, () => { })
        })
        expect(mockFn).toBeCalledTimes(0)

        // this should not cause any state update
        chrome.runtime.onMessage.callListeners({ type: 'live-chat' } as CatchedLiveChatRequestMessage, {}, () => { })

        // update the script 
        const res2 = { data: 2 } as LiveChatResponse
        const newScriptTextContent = 'window["ytInitialData"]=' + JSON.stringify(res2);
        await act(async () => {
            script.textContent = newScriptTextContent
        })
        expect(mockFn).toBeCalledTimes(1)
        expect(mockFn).toBeCalledWith(res2, 'init-live-chat')

        // remove the chatIframe ,the effect callback should not be call

        await act(async () => {
            document.body.textContent = ''
        })
        expect(mockFn).toBeCalledTimes(1)
    })

})