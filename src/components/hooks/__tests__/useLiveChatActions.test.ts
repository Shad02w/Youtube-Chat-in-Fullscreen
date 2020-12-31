import { cleanup, renderHook, act } from "@testing-library/react-hooks"
import { cleanupWindowMessages, setupChrome, setupWindowMessage } from "@/jest-setup";
import { chrome } from 'jest-chrome';
import { CatchedLiveChatRequestMessage, PageType } from "@models/Request";
import axios from 'axios';
import { useLiveChatActions } from "@hooks/useLiveChatActions";
import * as Player from '@models/Player';
import { InstantAdvancedChatLiveActions, LiveChatResponse2LiveChatActions, LiveChatResponse2LiveChatReplayActions } from "@models/Chat";
import { ContentScriptWindow } from "@models/Window";

// import live chat response sample
import s1 from '../../../sample/ReplayResponseSample.json'
import s2 from '../../../sample/LiveResponseSample.json';
import { LiveChatResponse } from "@models/Fetch";
import { PostMessageType } from "@models/PostMessage";

declare const global: { chrome: typeof chrome }
declare const window: ContentScriptWindow

const ReplayResponseSample: LiveChatResponse = s1
const LiveResponseSample: LiveChatResponse = s2

jest.mock('uuid', () => {
    return {
        v4: jest.fn(() => '12345')
    }
})

jest.useFakeTimers()
type ChannelType = 'window' | 'chrome'

const testCases = async (pageType: PageType, channel: ChannelType) => {


    const { result, waitFor } = renderHook(() => useLiveChatActions())
    expect(result.current.chatActions).toStrictEqual([])

    const messsage = { type: pageType, details: { url: 'url' } } as CatchedLiveChatRequestMessage

    // live-chat and replay-live-chat fetch data from internet
    if (pageType === 'live-chat' || pageType === 'replay-live-chat')
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: (pageType === 'live-chat') ? LiveResponseSample : ReplayResponseSample })

    if (channel === 'chrome') {
        await act(async () => {
            chrome.runtime.onMessage.callListeners(messsage, {}, () => { })
            jest.runAllTimers()
        })
    }
    else if (channel === 'window') {
        await act(async () => {
            window.messages.add(messsage)
            window.messages.pop()
            jest.runAllTimers()
        })

    }

    // init-live-chat and init-replay-live-chat fetch data from live chat iframe window object, by using intercept element
    if (pageType === 'init-replay-live-chat' || pageType === 'init-live-chat') {
        //mock page inject js
        await act(async () => {
            const responseMessage: PostMessageType = { type: 'response', response: pageType === 'init-live-chat' ? LiveResponseSample : ReplayResponseSample }
            window.postMessage(responseMessage, '*')
            jest.runAllTimers()
        })
    }

    const targetActions = pageType === 'init-live-chat' || pageType === 'live-chat'
        ?
        pageType === 'init-live-chat' ? InstantAdvancedChatLiveActions(LiveChatResponse2LiveChatActions(LiveResponseSample)) : LiveChatResponse2LiveChatActions(LiveResponseSample)
        :
        LiveChatResponse2LiveChatReplayActions(ReplayResponseSample)

    return waitFor(() => {
        expect(result.current.chatActions).toStrictEqual(targetActions)
    })
}


describe('useLiveChatActions', () => {

    beforeAll(() => {
        setupWindowMessage()
        setupChrome()
    })
    beforeEach(() => {
        jest.spyOn(Player, 'getCurrentPlayerTime').mockReturnValue(0)
        jest.useFakeTimers()
    })

    afterEach(() => {
        document.body.textContent = ''
        cleanupWindowMessages()
        jest.useRealTimers()
        jest.clearAllMocks()
        jest.restoreAllMocks()
        cleanup()
    })

    test('Should return proper chat actions according to live-chat meesage from background.js', async () => {
        await testCases('live-chat', 'chrome')
    })

    test('Should return proper chat actions according to replay-live-chat message from background.js', async () => {
        await testCases('replay-live-chat', 'chrome')
    })

    test('Should return proper chat actions according to init-live-chat message from background.js', async () => {
        await testCases('init-live-chat', 'chrome')
    })

    test('Should return proper chat actions according to init-replay-live-chat message from background.js', async () => {
        await testCases('init-replay-live-chat', 'chrome')
    })

    test('Should return proper chat actions according to init-live-chat message from window.messsages  ', async () => {
        await testCases('init-live-chat', 'window')
    })

    test('Should return proper chat actions according to init-replay-live-chat message from window.messsages  ', async () => {
        await testCases('init-replay-live-chat', 'window')
    })

    test('Should return proper chat actions according to live-chat message from chrome messsage  ', async () => {
        await testCases('live-chat', 'window')
    })

    test('Should return proper chat actions according to replay-live-chat message from chrome messsage  ', async () => {
        await testCases('replay-live-chat', 'window')
    })

})

