import { useChatBox } from "@hooks/useChatBox";
import { ChatBoxCollapsedAttributeName, isChatBoxExpanded } from "@models/ChatBox";
import { renderHook, cleanup, act } from "@testing-library/react-hooks";


const createChatBoxElement = () => {
    const chatbox = document.createElement('ytd-live-chat-frame')
    chatbox.id = 'chat'
    return chatbox
}



describe('useChatBox hook testing', () => {
    afterEach(async done => {
        await cleanup()
        document.body.textContent = ''
        done()
    })

    test('Should return false ready state when chatbox is not exist', () => {
        const { result } = renderHook(() => useChatBox())
        expect(result.current.ready).toBeFalsy()
        expect(result.current.expanded).toBeUndefined()
    })

    test('Should run normally when chatbox is expanded and collapsed, and removed', async () => {
        const chatbox = createChatBoxElement()
        document.body.append(chatbox)
        chatbox.setAttribute(ChatBoxCollapsedAttributeName, '')
        const { result } = renderHook(() => useChatBox())
        expect(result.current.ready).toBeTruthy()
        expect(result.current.expanded).toBeFalsy()


        await act(async () => {
            chatbox.removeAttribute(ChatBoxCollapsedAttributeName)
        })
        expect(result.current.expanded).toBeTruthy()


        await act(async () => {
            document.body.textContent = ''
        })
        expect(result.current.ready).toBeFalsy()
        expect(result.current.expanded).toBeUndefined()

        await act(async () => {
            document.body.appendChild(chatbox)
        })
        expect(result.current.ready).toBeTruthy()
        expect(result.current.expanded).toBeTruthy()

        // remove the chat box
        await act(async () => {
            document.body.textContent = ''
        })

        // then create chat box with collapsed attribute
        await act(async () => {
            chatbox.setAttribute(ChatBoxCollapsedAttributeName, '')
            document.body.appendChild(chatbox)
        })
        expect(result.current.ready).toBeTruthy()
        expect(result.current.expanded).toBeFalsy()
    })

})