import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    PlayerStateData,
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
