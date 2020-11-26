import { LiveChatResponse } from "./Fetch"

export const ChatBoxCollapsedAttributeName = 'collapsed'
export const ChatBoxTagName = 'ytd-live-chat-frame'
export const ChatBoxId = 'chat'
export const ChatFrameId = 'chatframe'

/**
 * @returns return undefined when chat box is not found, otherwise return the chat box element
 */
export const getChatBoxElement = (): Element | undefined => {
    const frames = document.getElementsByTagName(ChatBoxTagName)
    if (frames?.length === 0) return undefined
    const el = Array.from(frames).find(chat => chat.id === ChatBoxId)
    return el
}

/**
 * @returns return undefined when chat box is not found, boolean represent expand state
 */
export const isChatBoxExpanded = (): boolean | undefined => {
    const chatBox = getChatBoxElement()
    if (!chatBox) return undefined
    return !chatBox.hasAttribute(ChatBoxCollapsedAttributeName)
}


/**
 * @returns undefined or the iframe element of chat box
 */
export const getChatBoxIframe = (): HTMLIFrameElement | undefined => {
    return Array.from(document.getElementsByTagName('iframe')).find(el => el.id === ChatFrameId)
}

/**
 * @returns undefined or the script element contains ytInitData under Chat box iframe element
 */
export const getChatBoxIframeScript = (): HTMLScriptElement | undefined => {
    const iframe = Array
        .from(document.getElementsByTagName('iframe'))
        .find(i => i.classList.contains('ytd-live-chat-frame'))
    if (!iframe || !iframe.contentDocument) return undefined
    return Array
        .from(iframe.contentDocument.getElementsByTagName('script'))
        .find(i => i.textContent?.includes('ytInitialData'))
}

/**
 * 
 * @param content 
 * @returns Return the Live Chat response or {} is text content can not parse by JSON
 */
export const getLiveChatReponseFromWindowObjectString = (content: string): LiveChatResponse => {
    try {
        let dataString = content.slice(content.indexOf('=') + 1).trim()
        if (dataString[dataString.length - 1] === ';')
            dataString = dataString.slice(0, dataString.lastIndexOf(';'))
        return JSON.parse(dataString)
    } catch (error) {
        return {}
    }
}