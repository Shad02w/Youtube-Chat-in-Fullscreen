import { InterceptedDataElementId_PlayerState, PlayerStateData } from '@models/Intercept'
import { YTPlayerState } from '@models/Player'
import { useInterceptElementEffect } from './useInterceptElementEffect'
import { useState } from 'react'

export const usePlayerState = () => {
    const [playerState, setPlayerState] = useState<YTPlayerState>(YTPlayerState.UNSTARTED)
    useInterceptElementEffect<PlayerStateData>(({ state }) => {
        setPlayerState(state)
    }, InterceptedDataElementId_PlayerState)
    return { playerState }
}
