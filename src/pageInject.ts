import { getChatBoxIframeScript } from '@models/ChatBox'
import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    InterceptedDataElementId_InitLiveChat,
    PlayerStateData,
    InitLiveChatRequestAction
} from '@models/Intercept'
import { YTPlayerState } from '@models/Player'
import { ContentScriptWindow } from '@models/Window'

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


const getIframeInitLiveChatResponse_waiting = () => {
    return new Promise<{ content: string }>((resolve, reject) => {

        let content = getIframeInitLiveChatResponse()
        if (content) {
            resolve({ content })
            return
        }
        const timeoutId = setTimeout(() => reject('cannot get Init Live Chat Data from Live Chat iframe'), 6000)
        const iframeObserver = new MutationObserver(() => {
            //finishing
            content = getIframeInitLiveChatResponse()
            if (!content) return
            iframeObserver.disconnect()
            clearTimeout(timeoutId)
            resolve({ content })
        })
        iframeObserver.observe(document.body, { childList: true, subtree: true })

    })
}

const getIframeInitLiveChatResponse = () => {
    const s = getChatBoxIframeScript()
    if (!s) return undefined
    return s?.innerHTML || 'window["ytInitialData"] = {}'
}


const initLiveChatIEObserver = new MutationObserver(async () => {
    const data = initLiveChatInterceptElement.get()
    if (!data || !data.type || data.type !== 'REQUEST') return
    try {
        const { content } = await getIframeInitLiveChatResponse_waiting()
        let dataString = content.slice(content.indexOf('=') + 1)
        dataString = dataString.slice(0, dataString.lastIndexOf(';'))
        initLiveChatInterceptElement.set({ type: 'UPDATE', dataString })
    } catch (err) {
        console.error(err)
    }

})

initLiveChatIEObserver.observe(initLiveChatInterceptElement.element, { childList: true })
