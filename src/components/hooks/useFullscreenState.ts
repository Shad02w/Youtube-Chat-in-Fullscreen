import { useState, useCallback, useEffect } from 'react'

export const useFullscreenState = () => {

    const checkFullscreenState = () => document.fullscreenElement !== null
    const [isFullscreen, setIsFullscreen] = useState<boolean>(checkFullscreenState())

    const fullscreenChangeListener = useCallback(() => setIsFullscreen(checkFullscreenState()), [setIsFullscreen])

    useEffect(() => {
        document.addEventListener('fullscreenchange', fullscreenChangeListener)
        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeListener)
        }
    }, [fullscreenChangeListener])

    return { isFullscreen }
}
