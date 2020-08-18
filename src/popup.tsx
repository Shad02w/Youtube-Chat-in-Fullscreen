import React, { useState, useEffect, useMemo } from 'react'
import { render } from 'react-dom'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import './css/popup.css'
import icon from './images/chat.png'
import Switch from '@material-ui/core/Switch'
import Fade from '@material-ui/core/Fade'

const useStyle = makeStyles(theme => {
    const imageHeight = 1.2
    const normalPadding = 1
    return createStyles({
        container: {
            width: '20rem',
            height: 'auto',
            minHeight: '5rem',
            fontFamily: "'Noto Sans JP', sans-serif",
            gridGap: '0.6rem',
        },
        icon: {
            width: imageHeight + 'rem',
            height: imageHeight + 'rem',
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
            marginLeft: '0.7rem',
            fontSize: '1rem',
            fontWeight: 400
        },
        main: {
            padding: `${normalPadding}rem`,
        },
        part: {
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'space-around',
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
        console.log(changes, 'area', area)
        if (changes['on'])
            setExtEnable(changes['on'].newValue)
    }

    useEffect(() => {
        console.log('mounted effect')
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
        <Fade in={isReady} timeout={700}>
            <div className={classes.container}>
                <header className={classes.header}>
                    <img className={classes.icon} src={icon} alt="App icon" />
                    <h1 className={classes.appName}>Youtube Chat in Fullscreen</h1>
                </header>
                <main className={classes.main}>
                    <article className={classes.part} aria-label="">
                        <p className={classes.subHeader}>Show chat overlay when fullscreen in every youtube videos page</p>
                        <Switch checked={isExtEnable} onChange={() => chrome.storage.sync.set({ on: !isExtEnable })} />
                    </article>
                </main>
                <footer></footer>
            </div>
        </Fade>
    )
}

render(<App />, document.getElementById('root'))
