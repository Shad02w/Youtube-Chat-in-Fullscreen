import React, { useState, useEffect, useMemo } from 'react'
import { render } from 'react-dom'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import './css/popup.css'
import icon from './images/chat.png'
import Switch from '@material-ui/core/Switch'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme()
theme.typography.h6 = {
    fontSize: '1.1rem'
}

const useStyle = makeStyles(theme => {
    const normalPadding = 1
    return createStyles({
        container: {
            width: '20rem',
            height: 'auto',
            minHeight: '5rem',
            fontFamily: "'Noto Sans JP', sans-serif",
        },
        icon: {
            // width: imageHeight + 'rem',
            // height: imageHeight + 'rem',
            width: theme.spacing(3),
            height: theme.spacing(3),
            paddingBottom: '0.2rem'
        },
        header: {
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            padding: `${normalPadding}rem`,
            borderBottom: '1px solid #e6e6e6'
        },
        appName: {
            marginLeft: theme.spacing(2),
        },
        main: {
            padding: `${normalPadding}rem`,
        },
        part: {
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        subHeader: {
            fontSize: '0.8rem',
            fontWeight: 400,
            color: '#424242'
        }
    })
})

const App: React.FC = () => {
    const [isExtEnable, setExtEnable] = useState<boolean>(false)
    const [isReady, setReady] = useState<boolean>(false)
    const classes = useStyle()

    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
        if (changes['on'])
            setExtEnable(changes['on'].newValue)
    }

    useEffect(() => {
        chrome.storage.sync.get(['on'], (result) => {
            if (result['on'] !== undefined) {
                setExtEnable(result['on'] as boolean)
                setReady(true)
            }
        })

        chrome.storage.onChanged.addListener(storageListener)

        return () => {
            chrome.storage.onChanged.removeListener(storageListener)
        }

    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Fade in={isReady} timeout={700}>
                <div className={classes.container}>
                    <header className={classes.header}>
                        <img className={classes.icon} src={icon} alt="App icon" />
                        <Typography className={classes.appName} variant='h6' color='textPrimary'>Youtube Chat in Fullscreen</Typography>
                    </header>
                    <main className={classes.main}>
                        <article className={classes.part} aria-label="">
                            <Typography variant='subtitle1' color='textSecondary'>Show chat overlay</Typography>
                            <Switch checked={isExtEnable} onChange={() => chrome.storage.sync.set({ on: !isExtEnable })} />
                        </article>
                    </main>
                    <footer></footer>
                </div>
            </Fade>
        </ThemeProvider>
    )
}

render(<App />, document.getElementById('root'))
