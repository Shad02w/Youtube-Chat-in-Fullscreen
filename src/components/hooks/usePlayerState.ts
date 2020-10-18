import { useInterceptElementState } from './useElementState'
import { InterceptedDataElementId_PlayerState, PlayerStateData } from '../../models/Intercept'
import { YTPlayerState } from '../../models/Player'



export const usePlayerState = () => {
    const { data: { state: playerState } } = useInterceptElementState<PlayerStateData>(
        { state: YTPlayerState.UNSTARTED },
        InterceptedDataElementId_PlayerState
    )
    return { playerState }
}
