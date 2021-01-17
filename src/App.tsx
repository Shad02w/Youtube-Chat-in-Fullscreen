import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './css/App.css'
import { ChatOverlay } from './components/ChatOverlay'
import { StorageContextProvider } from './contexts/StorageContext'
import { ChatContextProvider } from './contexts/ChatContext'
import { ContentScriptWindow } from './models/Window';
import { ThemeColor } from './models/Color'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: `#${ThemeColor[100]}`,
            main: `#${ThemeColor[200]}`,
            dark: `#${ThemeColor[300]}`
        }
    },
})

declare const window: ContentScriptWindow

export const App: React.FC = () => {


    return (
        <StorageContextProvider>
            <ChatContextProvider>
                <ThemeProvider theme={theme}>
                    <ChatOverlay />
                </ThemeProvider>
            </ChatContextProvider>
        </StorageContextProvider>
    )
}
