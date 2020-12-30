/**
 * Use for changeing message between content script and embedding page
 * using window.postMessage
 */

import { LiveChatResponse } from "@models/Fetch";

export type PostMessageType = {
    type: 'request'
} | {
    type: 'response',
    data: LiveChatResponse
}