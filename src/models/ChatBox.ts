export const ChatBoxCollapsedAttributeName = 'collapsed'
export const ChatBoxTagName = 'ytd-live-chat-frame'
export const ChatBoxId = 'chat'

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

