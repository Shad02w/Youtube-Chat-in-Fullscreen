import { InterceptedDataElementId_PlayerState, PlayerStateData } from '@models/Intercept'
import { YTPlayerState } from '@models/Player'
import { useInterceptElement } from './useInterceptElement'

export const usePlayerState = () => {
    const {
        data: { state: playerState },
    } = useInterceptElement<PlayerStateData>(InterceptedDataElementId_PlayerState, { state: YTPlayerState.UNSTARTED })
    return { playerState }
}
