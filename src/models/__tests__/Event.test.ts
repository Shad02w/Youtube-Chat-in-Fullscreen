import { Messages } from '@models/Event'
import { CatchedLiveChatRequestMessage } from '@models/Request'

declare const window: Window & { messages: Messages }

describe('MessageEvent test', () => {
    const message1 = { type: 'init-live-chat', details: { frameId: 1 } } as CatchedLiveChatRequestMessage
    const message2 = { type: 'init-live-chat', details: { frameId: 2 } } as CatchedLiveChatRequestMessage

    Object.defineProperty(window, 'messages', { value: new Messages([]), writable: true })

    beforeEach(() => {
        window.messages = new Messages([])
        window.messages.add(message1)
        window.messages.add(message2)
    })

    test('Should add messsges to end of message list', () => {
        const message3 = { type: 'init-live-chat', details: { frameId: 3 } } as CatchedLiveChatRequestMessage
        window.messages.add(message3)
        expect(window.messages.list).toStrictEqual([message1, message2, message3])
        expect(window.messages.list[window.messages.list.length - 1]).toStrictEqual(message3)
    })

    test('Should dispatch a "release" event when pop a message from a non-empty message list', () => {
        const mockListener = jest.fn().mockImplementation((message: CustomEvent<CatchedLiveChatRequestMessage>) => message.detail)
        window.messages.addEventListener('release', mockListener)

        expect(window.messages.list.length).not.toBe(0)
        const poped = window.messages.pop()
        expect(mockListener).toBeCalledTimes(1)

        expect(poped).toStrictEqual(message1)
        expect(mockListener.mock.results[0].value).toStrictEqual(message1)

        expect(window.messages.list.length).toEqual(1)
    })

    test('Should return undefined when message list have nothing to pop', () => {
        window.messages = new Messages([])
        const mockListener = jest.fn()
        window.messages.addEventListener('release', mockListener)
        expect(window.messages.list.length).toBe(0)

        const poped = window.messages.pop()

        expect(mockListener).toBeCalledTimes(0)
        expect(poped).toBeUndefined()
    })

    test('Call popAll() should dispatch multiple "release" events which according to length of messages list', () => {
        const mockListener = jest.fn()
        window.messages.addEventListener('release', mockListener)
        window.messages.popAll()
        expect(mockListener).toBeCalledTimes(2)
        expect(window.messages.list.length).toBe(0)
    })

    test('Should empty the list array when calling clear()', () => {
        window.messages.clear()
        expect(window.messages.list.length).toBe(0)
    })
})
