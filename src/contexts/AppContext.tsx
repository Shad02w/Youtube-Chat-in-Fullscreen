/**
 * This context rely on StorageContext
 */
import { useChatBox } from "@hooks/useChatBox";
import { useFullscreenState } from "@hooks/useFullscreenState";
import React, { createContext, useContext, useMemo, useState } from "react";
import { StorageContext } from "./StorageContext";

interface AppContextType {
    showOverlay: boolean
    setShowOverlay: (value: boolean) => any
}

type AppContextProviderProps = React.PropsWithChildren<{}>

export const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {

    const [showOverlayPartly, setShowOverlay] = useState<boolean>(false)
    const { storage: { show: show_storage } } = useContext(StorageContext)
    const { isFullscreen } = useFullscreenState()
    const { expanded } = useChatBox()

    const showOverlay = useMemo(() => (show_storage && isFullscreen && expanded === true && showOverlayPartly), [showOverlayPartly, show_storage, isFullscreen, expanded])

    return (
        <AppContext.Provider value={{ showOverlay, setShowOverlay }}>
            {children}
        </AppContext.Provider>
    )

}
