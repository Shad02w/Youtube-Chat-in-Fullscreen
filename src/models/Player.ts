const Sec2MSec = (second: number) => second * 1000

export const getPlayer = () => Array.from(document.getElementsByTagName('video')).find(el => el.classList.contains('html5-main-video'))

/*Return time in Msec */
export const getCurrentPlayerTime = () => Sec2MSec(getPlayer()?.currentTime || 0)

export enum YTPlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
    UNSTARTED = -1
}