import { useChatBox } from '@hooks/useChatBox'
import { ChatBoxCollapsedAttributeName, ChatBoxId, ChatBoxTagName } from '@models/Chat'
import { cleanup, act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'

describe('Testing for useChatBox hook', () => {
    afterEach(async () => {
        await cleanup()
        document.body.textContent = ''
    })

    test('Should return undefined when chat box does not exist', () => {
        const { result } = renderHook(() => useChatBox())
        expect(result.current.expanded).toBeUndefined()
    })

    test.only('Should return expected expanded state when chat box is collapsed and expanded', async () => {
        document.body.innerHTML = `<${ChatBoxTagName} id="${ChatBoxId}" ${ChatBoxCollapsedAttributeName}></${ChatBoxTagName}>`

        const { result } = renderHook(() => useChatBox())

        expect(result.current.expanded).toBeFalsy()

        await act(async () => {
            const chatBox = document.getElementById('chat')
            if (chatBox) chatBox.removeAttribute(ChatBoxCollapsedAttributeName)
        })

        waitFor(() => {
            expect(result.current.expanded).toBeTruthy()
        })

        await act(async () => {
            const chatBox = document.getElementById('chat')
            if (chatBox) chatBox.setAttribute(ChatBoxCollapsedAttributeName, '')
        })

        return waitFor(() => {
            expect(result.current.expanded).toBeFalsy()
        })
    })
})
