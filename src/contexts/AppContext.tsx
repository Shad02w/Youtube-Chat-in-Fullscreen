/**
 * This context rely on StorageContext
 */
import React, { createContext, useState } from "react";

interface AppContextType {
    showOverlay: boolean
    setShowOverlay: (value: boolean) => any
}

type AppContextProviderProps = React.PropsWithChildren<{}>

export const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {

    const [showOverlay, setShowOverlay] = useState<boolean>(false)

    return (
        <AppContext.Provider value={{ showOverlay, setShowOverlay }}>
            {children}
        </AppContext.Provider>
    )

}
