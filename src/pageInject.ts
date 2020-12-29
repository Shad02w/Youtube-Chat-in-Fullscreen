import { getChatBoxIframe, getChatBoxIframeScript } from '@models/ChatBox'
import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    PlayerStateData,
} from '@models/Intercept'
import { YTPlayerState } from '@models/Player'

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


const iframeObserver = new MutationObserver(() => {
    const iframe = getChatBoxIframe()
    let scriptObserver: MutationObserver | undefined = undefined
    if (iframe) {
        const script = getChatBoxIframeScript()
        console.log(script)
    }
})

iframeObserver.observe(document.body, { childList: true, subtree: true })