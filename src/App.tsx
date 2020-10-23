import React, { useEffect } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './css/App.css'
import { ChatOverlay } from './components/ChatOverlay'
import { StorageContextProvider } from './contexts/StorageContext'
import { AppContextProvider } from './contexts/AppContext'
import { ContentScriptWindow } from './models/Window';

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    },
})

declare const window: ContentScriptWindow

export const App: React.FC = () => {


    return (
        <StorageContextProvider>
            <AppContextProvider>
                <ThemeProvider theme={theme}>
                    <ChatOverlay />
                </ThemeProvider>
            </AppContextProvider>
        </StorageContextProvider>
    )
}
