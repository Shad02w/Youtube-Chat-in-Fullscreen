import axios from 'axios'
// replay the get_live_chat xhr request to get the response
export interface ConnectionMessage {
    url: string
}

chrome.runtime.onMessage.addListener((message: ConnectionMessage, sender) => {
    if (sender.id === chrome.runtime.id && message.url) {
        // if (message.url.includes('https://www.youtube.com/live_chat/get_live_chat')) {
        //     axios.get('https://stackoverflow.com/questions/43523652/how-do-you-identify-a-specific-frame-id-and-inject-content-into-its-body').then(res => console.log(res.data))
        // }
        axios.get(message.url).then(res => console.log(res.data))
    }
})






// going to use google stream api directly



/**This method can not catch all xhr request, dont not why */
// console.log(`js inject`)
// // Load xhr mod script to the page
// const script = document.createElement('script')
// script.src = chrome.runtime.getURL('xhrMod.js');
// document.head.appendChild(script)


// try to make the get_live_chat request again

console.log('js injected')










