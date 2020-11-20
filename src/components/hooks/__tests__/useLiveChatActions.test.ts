import { cleanup, renderHook, act } from "@testing-library/react-hooks"
import { cleanupWindowMessages, setupChrome, setupWindowMessage } from "@/jest-setup";
import { chrome } from 'jest-chrome';
import { CatchedLiveChatRequestMessage, PageType } from "@models/Request";
import axios from 'axios';
import { useLiveChatActions } from "@hooks/useLiveChatActions";
import * as Player from '@models/Player';
import { LiveChatResponse2LiveChatActions, LiveChatResponse2LiveChatReplayActions } from "@models/Chat";
import { createInterceptElement, getInterceptElementContent, InitLiveChatRequestAction, InterceptedDataElementId_InitLiveChat } from "@models/Intercept";
import { ContentScriptWindow } from "@models/Window";

// import live chat response sample
import ReplayResponseSample from '../../../sample/ReplayResponseSample.json'
import LiveResponseSample from '../../../sample/LiveResponseSample.json';

declare const global: { chrome: typeof chrome }
declare const window: ContentScriptWindow

jest.mock('uuid', () => {
    return {
        v4: jest.fn(() => '12345')
    }
})

jest.useFakeTimers()

const test_WindowMessage = async (pageType: PageType) => {

    const initAction: InitLiveChatRequestAction = { type: 'UPDATE', dataString: JSON.stringify({}) }
    const interceptEl = createInterceptElement<InitLiveChatRequestAction>(InterceptedDataElementId_InitLiveChat, initAction)
    interceptEl.mount()

    const { result } = renderHook(() => useLiveChatActions())
    expect(result.current.chatActions).toStrictEqual([])

    const initReplayLiveChatMessage = { type: pageType } as CatchedLiveChatRequestMessage
    window.messages.add(initReplayLiveChatMessage)
    await act(async () => {
        window.messages.pop()
        jest.runAllTimers()
    })

    if (pageType === 'init-replay-live-chat' || pageType === 'init-live-chat') {
        expect(getInterceptElementContent(document.getElementById(InterceptedDataElementId_InitLiveChat)!)).toStrictEqual({ type: 'REQUEST' } as InitLiveChatRequestAction)
        //mock page inject js
        await act(async () => {
            const updateInitAction: InitLiveChatRequestAction = { type: 'UPDATE', dataString: JSON.stringify(pageType === 'init-live-chat' ? LiveResponseSample : ReplayResponseSample) }
            interceptEl.set(updateInitAction)
        })
        const targetActions = pageType === 'init-live-chat' ?
            LiveChatResponse2LiveChatActions(LiveResponseSample) :
            LiveChatResponse2LiveChatReplayActions(ReplayResponseSample)
        expect(result.current.chatActions).toStrictEqual(targetActions)
    }
    else if (pageType === 'live-chat' || pageType === 'replay-live-chat') {

    }
}
describe('useLiveChatActions', () => {

    beforeAll(() => {
        setupWindowMessage()
        setupChrome()
    })
    beforeEach(() => {
        jest.spyOn(Player, 'getCurrentPlayerTime').mockReturnValue(0)
    })

    afterEach(() => {
        document.body.textContent = ''
        cleanupWindowMessages()
        jest.clearAllMocks()
        jest.restoreAllMocks()
        cleanup()
    })

    test('Should return proper chat actions according to live-chat meesage from background.js', async () => {
        const { result } = renderHook(() => useLiveChatActions())
        expect(result.current.chatActions).toStrictEqual([])

        await act(async () => {
            jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: LiveResponseSample })
            const message = { type: 'live-chat', details: { url: 'url' } } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })
        expect(result.current.chatActions).toStrictEqual(LiveChatResponse2LiveChatActions(LiveResponseSample))
    })

    test('Should return proper chat actions according to replay-live-chat message from background.js', async () => {
        const { result } = renderHook(() => useLiveChatActions())
        expect(result.current.chatActions).toStrictEqual([])

        await act(async () => {
            jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: ReplayResponseSample })
            const message = { type: 'replay-live-chat', details: { url: 'url' } } as CatchedLiveChatRequestMessage
            chrome.runtime.onMessage.callListeners(message, {}, () => { })
        })
        expect(result.current.chatActions).toStrictEqual(LiveChatResponse2LiveChatReplayActions(ReplayResponseSample))
    })

    test('Should return proper chat actions according to init-live-chat message from window.messsages  ', async () => {
        await test_WindowMessage('init-live-chat')
    })

    test('Should return proper chat actions according to init-replay-live-chat message from window.messsages  ', async () => {
        await test_WindowMessage('init-replay-live-chat')
    })

})

