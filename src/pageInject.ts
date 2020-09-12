import { InterceptedDataElementId } from './models/Intercept'

console.log('This is page inject js , can touch youtube pp')



// Create a container element for holding intercepted current player time of the youtube player 
const interceptedElement = document.createElement('div')
interceptedElement.id = InterceptedDataElementId
document.body.append(interceptedElement)

const observer = new MutationObserver(() => {
    const player = document.getElementById('movie_player') as any
    if (!player) return
    player.addEventListener('onStateChange', (data: number) => {
        interceptedElement.innerHTML = data.toString()
    })
    observer.disconnect()

})

observer.observe(document.body, { childList: true, subtree: true })





