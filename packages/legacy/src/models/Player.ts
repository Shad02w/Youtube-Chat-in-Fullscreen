const Sec2MSec = (second: number) => second * 1000
const Player = () => document.getElementsByClassName('html5-main-video')[0] as HTMLVideoElement

/* Return time in Msec */
export const getCurrentPlayerTime = () => Sec2MSec(Player().currentTime)

export enum YTPlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
    UNSTARTED = -1,
}
