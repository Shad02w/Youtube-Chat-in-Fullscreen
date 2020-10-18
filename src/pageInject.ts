import {
    createInterceptElement,
    InterceptedDataElementId_PlayerState,
    PlayerStateData
} from './models/Intercept'

/**
 * Create a container element for holding player state of the youtube player
 */
const playerStateInterceptElement = createInterceptElement(InterceptedDataElementId_PlayerState)
document.body.append(playerStateInterceptElement.element)

const observer = new MutationObserver(() => {
    const player = document.getElementById('movie_player') as any
    if (!player) return
    player.addEventListener('onStateChange', (state: number) => {
        const data: PlayerStateData = { state }
        playerStateInterceptElement.set(data)
    })
    observer.disconnect()
})

observer.observe(document.body, { childList: true, subtree: true })





