import { LiveChatResponse } from "./Fetch";

export type PostMessageType = {
    type: 'request'
} | {
    type: 'response', response: LiveChatResponse
}