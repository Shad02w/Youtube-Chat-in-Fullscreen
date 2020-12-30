import { getChatBoxIframeScript, getLiveChatReponseFromWindowObjectString } from '@models/ChatBox'
import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    PlayerStateData,
} from '@models/Intercept'
import { YTPlayerState } from '@models/Player'
import { PostMessageType } from '@models/PostMessage'
interface myWindow extends Window {
    sayHi(): any
}

declare const window: myWindow;

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

window.addEventListener('message', (event) => {
    if (event.source !== window) return
    const message: PostMessageType = event.data
    if (message.type !== 'request') return
    const script = getChatBoxIframeScript()
    if (!script || !script.textContent) return
    console.log('request received')
    console.dir(script.innerText)
    const responseMessage: PostMessageType = {
        type: 'response',
        data: getLiveChatReponseFromWindowObjectString(script.innerText)
    }
    window.postMessage(responseMessage, '*', undefined)
    // Array.from(document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('script')).find(i => i.textContent?.includes('ytInitialData')).textContent

})