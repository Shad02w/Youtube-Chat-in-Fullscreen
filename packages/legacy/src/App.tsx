import React from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { ChatOverlay } from '@components/ChatOverlay'
import { StorageContextProvider } from '@contexts/StorageContext'
import { ThemeColor } from '@models/Color'
import { AppContextProvider } from '@contexts/AppContext'
import './css/App.css'
import './css/NativeChatFilter.css'

const theme = createTheme({
    typography: {
        h5: {
            fontSize: '1.6rem'
        }
    },
    palette: {
        type: 'dark',
        primary: {
            light: `#${ThemeColor[100]}`,
            main: `#${ThemeColor[200]}`,
            dark: `#${ThemeColor[300]}`
        }
    }
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
