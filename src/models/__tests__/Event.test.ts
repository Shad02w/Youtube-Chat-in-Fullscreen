import { Done } from "@material-ui/icons"
import { Messages } from "@models/Event"
import { CatchedLiveChatRequestMessage } from "@models/Request"
import { ContentScriptWindow } from "@models/Window"

const mockWindow = {} as ContentScriptWindow


describe('MessageEvent test', () => {
    const message1 = { type: 'init-live-chat', details: { frameId: 1 } } as CatchedLiveChatRequestMessage

    beforeAll(() => {
        mockWindow.messages = new Messages([])
        mockWindow.messages.add(message1)
    })

    test('Add to the end of the list', () => {
        const message2 = { type: 'init-live-chat', details: { frameId: 2 } } as CatchedLiveChatRequestMessage
        mockWindow.messages.add(message2)
        expect(mockWindow.messages.list).toStrictEqual([message1, message2])
    })


    test('Pop event and catch by event listener', () => {
        const mockListener = jest.fn()
            .mockImplementation((message: CustomEvent<CatchedLiveChatRequestMessage>) => message.detail)
        mockWindow.messages.addEventListener('release', mockListener)
        mockWindow.messages.pop()
        expect(mockListener.mock.results[0].value).toStrictEqual(message1)
        expect(mockWindow.messages.list.length).toEqual(1)
    })

})