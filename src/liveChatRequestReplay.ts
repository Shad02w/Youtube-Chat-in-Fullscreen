import axios from 'axios'
/* Replay the get_live_chat xhr request to get the response */
export interface ConnectionMessage {
    url: string
}


/**This method is for live chat replay */
chrome.runtime.onMessage.addListener(async (message: ConnectionMessage, sender) => {
    if (sender.id === chrome.runtime.id && message.url) {
        axios.get(message.url).then(res => console.log(res.data))
    }
})