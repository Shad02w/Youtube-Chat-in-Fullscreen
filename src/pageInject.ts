console.log('This is page inject js , can touch pp')

// const video = document.getElementsByTagName('video')[0] as any
// console.log(video)
// console.log(video.getCurrentTime())

console.log('chrome', chrome)



const player = document.getElementById('movie_player')
console.log('player', player)
player?.addEventListener('onStateChange', (event) => {
})
