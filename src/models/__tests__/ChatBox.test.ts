import { ChatBoxId, ChatFrameId, getChatBoxElement, getChatBoxIframe, getChatBoxIframeScript, getLiveChatReponseFromWindowObjectString } from '@models/ChatBox'
import { createChatBox } from '@/jest-setup'
import { LiveChatResponse } from '@models/Fetch'
import { waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'



describe('ChatBox function test', () => {

    afterEach(() => {
        document.textContent = ''
    })
    const response = { data: 1 } as LiveChatResponse

    test('Should Get element or undefined form functions depend on DOM', async () => {

        let el = getChatBoxElement()
        expect(el).toBeUndefined()

        el = getChatBoxIframe()
        expect(el).toBeUndefined()

        el = getChatBoxIframeScript()
        expect(el).toBeUndefined()

        const { chatbox, iframe, script, scriptTextContent } = createChatBox(response)
        document.body.appendChild(chatbox)

        el = getChatBoxElement()
        expect(el?.id).toBe(ChatBoxId)

        el = getChatBoxIframe()
        expect(el?.id).toBe(ChatFrameId)

        iframe.src = 'wwww.youtube.com'
        chatbox.appendChild(iframe)

        waitFor(() => expect(iframe.contentDocument).toBeDefined())
        iframe.contentDocument!.appendChild(script)

        el = getChatBoxIframeScript()
        expect(el).toBeDefined()
        expect(el?.textContent).toBe(scriptTextContent)

        let res = getLiveChatReponseFromWindowObjectString(el!.textContent!)
        expect(res).toStrictEqual(response)

        script.textContent = scriptTextContent + ';'
        res = getLiveChatReponseFromWindowObjectString(el!.textContent!)
        expect(res).toStrictEqual(response)

        //if textContent in script is can not be parse by JSON, return a empty object
        script.textContent = scriptTextContent + '{};'
        res = getLiveChatReponseFromWindowObjectString(el!.textContent!)
        expect(res).toStrictEqual({})
    })

})