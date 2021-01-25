/**
 * This context rely on StorageContext
 */
import { useChatBox } from "@hooks/useChatBox";
import { useFullscreenState } from "@hooks/useFullscreenState";
import { useUrl } from "@hooks/useUrl";
import { ChatFilter } from "@models/ChatFilter";
import React, { createContext, useContext, useMemo, useState } from "react";
import { StorageContext } from "./StorageContext";

interface AppContextType {
    showOverlay: boolean
    setShowOverlay: (value: boolean) => any
    chatFilter: ChatFilter
    setChatFilter: React.Dispatch<React.SetStateAction<ChatFilter>>
}

type AppContextProviderProps = React.PropsWithChildren<{}>

const ChatFilter_Default: ChatFilter = {
    guest: true,
    member: true,
    moderator: true,
    owner: true,
    sticker: true,
    superchat: true,
    membership: true
}

export const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {

    const [showOverlayPartly, setShowOverlay] = useState<boolean>(false)
    const { storage: { show: show_storage } } = useContext(StorageContext)
    const [chatFilter, setChatFilter] = useState<ChatFilter>(ChatFilter_Default)
    const { isFullscreen } = useFullscreenState()
    const { expanded } = useChatBox()
    useUrl(() => {
        setChatFilter(ChatFilter_Default)
    })

    const showOverlay = useMemo(() => (show_storage && isFullscreen && expanded === true && showOverlayPartly), [showOverlayPartly, show_storage, isFullscreen, expanded])

    return (
        <AppContext.Provider value={{ showOverlay, setShowOverlay, chatFilter, setChatFilter }}>
            {children}
        </AppContext.Provider>
    )

}
