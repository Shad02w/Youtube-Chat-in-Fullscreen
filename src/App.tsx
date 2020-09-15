import React from 'react'
import { AppContextProvider } from './components/AppContext'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import './css/App.css'
import { ChatOverlay } from './components/ChatOverlay'




const theme = createMuiTheme({
    palette: {
        type: 'dark'
    },
})

export const App: React.FC = () => {


    return (
        <ThemeProvider theme={theme}>
            <AppContextProvider>
                <ChatOverlay />
            </AppContextProvider>
        </ThemeProvider>
    )
}
