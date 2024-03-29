import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Fade, IconButton, Snackbar, Tooltip, Typography, Box, Switch } from '@material-ui/core'
import '@css/popup.css'
import icon from '@icons/chat128.png'
import { GitHub, Replay } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { StoragePreset } from '@models/Storage'
import { ThemeColor } from '@models/Color'

const githubPage = 'https://github.com/Shad02w/Youtube-Chat-in-Fullscreen'

const theme = createMuiTheme({
    typography: {
        h6: {
            fontSize: '1.1rem'
        }
    },
    palette: {
        primary: {
            light: `#${ThemeColor[100]}`,
            main: `#${ThemeColor[200]}`,
            dark: `#${ThemeColor[300]}`
        }
    }
})

const normalPadding = 1

const useStyle = makeStyles({
    container: {
        width: '25rem',
        height: 'auto',
        minHeight: '5rem',
        fontFamily: '\'Noto Sans JP\', sans-serif'
    },
    icon: {
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
        fontWeight: 600,
        marginLeft: theme.spacing(2)
    },
    main: {
        padding: `${normalPadding}rem`
    },
    part: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.6rem',
        marginBottom: '0.6rem'
    },
    partName: {
        fontWeight: 600
    },
    footer: {
        borderTop: '1px solid #e6e6e6',
        padding: `0.4rem ${normalPadding}rem`,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    beta: {
        fontSize: '0.65rem',
        padding: '4px 2px 4px 2px',
        background: 'red',
        color: '#fff',
        marginLeft: '0.4rem',
        borderRadius: '3px'
    }
})

const App: React.FC = () => {
    const [isExtEnable, setExtEnable] = useState<boolean>(false)
    const [isReady, setReady] = useState<boolean>(false)
    const [isNative, setNative] = useState<boolean>(false)
    const [storageReset, setStorageReset] = useState<boolean>(false)

    const classes = useStyle()

    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes['on']) setExtEnable(changes['on'].newValue)
        if (changes['native']) setNative(changes['native'].newValue)
    }

    useEffect(() => {
        chrome.storage.local.get(null, result => {
            if (result['on'] !== undefined) {
                setExtEnable(result['on'] as boolean)
            }
            if (result['native'] !== undefined) {
                setNative(result['native'] as boolean)
            }
            setReady(true)
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
                        <img className={classes.icon} src={icon}
alt="App icon" />
                        <Typography className={classes.appName} variant="h6"
color="textPrimary">
                            Youtube Chat in Fullscreen
                        </Typography>
                    </header>
                    <main className={classes.main}>
                        <article className={classes.part}>
                            <article>
                                <Typography className={classes.partName} variant="body1"
color="textSecondary">
                                    Show chat overlay
                                </Typography>
                                <Typography style={{ fontSize: '0.8rem' }} variant="subtitle2"
color="textSecondary">
                                    Refresh is needed
                                </Typography>
                            </article>
                            <Switch checked={isExtEnable} onChange={() => chrome.storage.local.set({ on: !isExtEnable })} />
                        </article>
                        <article className={classes.part}>
                            <article>
                                <Box display="flex" flexDirection="row"
alignItems="center" flexWrap="nowrap">
                                    <Typography className={classes.partName} variant="body1"
color="textSecondary">
                                        Native Mode
                                    </Typography>
                                    <div className={classes.beta}>BETA</div>
                                </Box>
                                <Typography style={{ fontSize: '0.8rem' }} variant="subtitle2"
color="textSecondary">
                                    Refresh is needed
                                </Typography>
                            </article>
                            <Switch checked={isNative} onChange={() => chrome.storage.local.set({ native: !isNative })} />
                        </article>
                        <article className={classes.part}>
                            <article>
                                <Typography className={classes.partName} variant="body1"
color="textSecondary">
                                    Reset Overlay
                                </Typography>
                                <Typography style={{ fontSize: '0.8rem' }} variant="subtitle2"
color="textSecondary">
                                    This will reset all the settings, like overlay position, opacity, width, height, etc. to default
                                </Typography>
                            </article>
                            <Tooltip title={'Reset'}>
                                <IconButton onClick={() => chrome.storage.local.set(StoragePreset, () => setStorageReset(true))} aria-label="reset">
                                    <Replay />
                                </IconButton>
                            </Tooltip>
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                // message={'Successfully reset'}
                                open={storageReset}
                                autoHideDuration={3000}
                                onClose={() => setStorageReset(false)}
                            >
                                <Alert elevation={5} variant="standard"
severity="success">
                                    Successfully reset
                                </Alert>
                            </Snackbar>
                        </article>
                        <article>
                            <Typography gutterBottom variant="h6">
                                Tips
                            </Typography>
                            <Typography gutterBottom variant="body2">
                                Use <code>Ctrl+Shift+y</code> to toggle overlay
                            </Typography>
                            <Typography gutterBottom variant="body2">
                                Press <code>Ctrl+Alt</code> then drag to move overlay
                            </Typography>
                        </article>
                    </main>
                    <footer className={classes.footer}>
                        <IconButton onClick={() => chrome.tabs.create({ url: githubPage })} aria-label="github page of author">
                            <GitHub />
                        </IconButton>
                    </footer>
                </div>
            </Fade>
        </ThemeProvider>
    )
}

render(<App />, document.getElementById('root'))
