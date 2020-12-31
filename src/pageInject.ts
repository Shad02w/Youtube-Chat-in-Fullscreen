import { PostMessageType } from '@models/PostMessage'
import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    InterceptedDataElementId_InitLiveChat,
    PlayerStateData,
    InitLiveChatRequestAction
} from './models/Intercept'
import { YTPlayerState } from './models/Player'
import { ContentScriptWindow } from './models/Window'

declare const window: ContentScriptWindow

/**
 * Create a div element for holding player state of the youtube player
 */
const playerStateInterceptElement = createInterceptElement<PlayerStateData>(InterceptedDataElementId_PlayerState, { state: YTPlayerState.UNSTARTED })
playerStateInterceptElement.mount()

const playerStateIEObserver = new MutationObserver(() => {
    const player = document.getElementById('movie_player') as any
    if (!player) return
    player.addEventListener('onStateChange', (state: YTPlayerState) => {
        const data: PlayerStateData = { state }
        playerStateInterceptElement.set(data)
    })
    playerStateIEObserver.disconnect()
})

playerStateIEObserver.observe(document.body, { childList: true, subtree: true })


/*
* Create a div element for responing request and update the init data from live chat iframe
*/
const initLiveChatInterceptElement = createInterceptElement<InitLiveChatRequestAction>(InterceptedDataElementId_InitLiveChat, { type: 'UPDATE', dataString: JSON.stringify({}) })
initLiveChatInterceptElement.mount()

const getChatIframe = () => {
    const iframe = Array
        .from(document.getElementsByTagName('iframe'))
        .find(i => i.classList.contains('ytd-live-chat-frame'))
    if (!iframe || !iframe.contentDocument) return undefined
    return iframe
}

const getChatIframeScript = () => {
    const iframe = getChatIframe()
    if (!iframe || !iframe.contentDocument) return undefined
    return Array
        .from(iframe.contentDocument.getElementsByTagName('script'))
        .find(i => i.innerText.includes('ytInitialData'))
}

const parseInitLiveChatResponseFromScript = (content: string) => {
    let dataString = content.slice(content.indexOf('=') + 1).trim()
    if (dataString[dataString.length - 1] === ';')
        dataString = dataString.slice(0, dataString.lastIndexOf(';'))
    return dataString
}

const getIframeInitLiveChatResponse = () => {
    return new Promise<{ content: string }>((resolve, reject) => {
        const timeoutId = setTimeout(() => reject('cannot get Init Live Chat Data from Live Chat iframe'), 6000)

        const iframeObserver = new MutationObserver(() => {
            const s = getChatIframeScript()
            if (!s) return
            resolve({
                content: s.innerHTML,
            })
            //finishing
            iframeObserver.disconnect()
            clearTimeout(timeoutId)

        })
        iframeObserver.observe(document.body, { childList: true, subtree: true })
    })
}


const initLiveChatIEObserver = new MutationObserver(async () => {
    const data = initLiveChatInterceptElement.get()
    if (!data || !data.type || data.type !== 'REQUEST') return
    try {

        const { content } = await getIframeInitLiveChatResponse()
        const dataString = parseInitLiveChatResponseFromScript(content)
        initLiveChatInterceptElement.set({ type: 'UPDATE', dataString })
    } catch (err) {
        console.error(err)
    }
})

initLiveChatIEObserver.observe(initLiveChatInterceptElement.element, { childList: true })

window.addEventListener('message', event => {
    if (event.source !== window || !event.data || (event.data as PostMessageType).type !== 'request') return
    const s = getChatIframeScript()
    if (!s || !s.textContent) return
    try {
        const json = JSON.parse(parseInitLiveChatResponseFromScript(s.textContent))
        const responseMessage: PostMessageType = {
            type: 'response',
            response: json
        }
        window.postMessage(responseMessage, '*')
    } catch (error) {
        console.error(error);
    }
})