import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './css/App.css'
import { ChatOverlay } from './components/ChatOverlay'
import { StorageContextProvider } from './contexts/StorageContext'
import { AppContextProvider } from './contexts/AppContext'

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    },
})

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
