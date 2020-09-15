import React, { useState, createContext, useEffect, useCallback, useContext, useMemo } from 'react'
import { ChatContext } from './ChatContext'

interface IAppContext {
    show: boolean
}


export const AppContext = createContext<IAppContext>({ show: false })

const checkFullscreenState = () => document.fullscreenElement !== null

const useFullScreen = () => {
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


export const AppContextProvider: React.FC = ({ children }) => {
    const { isFullscreen } = useFullScreen()
    const { chatList } = useContext(ChatContext)
    const show = useMemo(() => (isFullscreen && chatList.length > 0), [chatList, isFullscreen])

    return (
        <AppContext.Provider value={{ show }}>
            {children}
        </AppContext.Provider>
    )

}
