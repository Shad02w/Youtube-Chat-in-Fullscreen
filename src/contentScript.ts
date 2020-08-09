import axios from 'axios'

/* Replay the get_live_chat xhr request to get the response */
export interface ConnectionMessage {
    url: string
}


chrome.runtime.onMessage.addListener(async (message: ConnectionMessage, sender) => {
    if (sender.id === chrome.runtime.id && message.url) {
        axios.get(message.url).then(res => console.log(res.data))
    }
})






// going to use google stream api directly



/** Changing XMLHttpRequest prototype can not catch all xhr request, dont not why */
// const script = document.createElement('script')
// script.src = chrome.runtime.getURL('xhrMod.js');
// document.head.appendChild(script)



console.log('js injected')










