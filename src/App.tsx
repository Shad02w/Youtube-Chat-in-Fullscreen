import React, { useState, useEffect, createContext, useMemo, useContext } from 'react'

import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { ChatContext } from './components/ChatContext'
import './css/App.css'
import { StorageContext } from './components/StorageContext'
import { Motion } from './components/Motion'
import { ChatList } from './components/ChatList'
import { Control } from './components/Control'
import { MinHeight, MinWidth } from './models/Storage'




const theme = createMuiTheme({
    palette: {
        type: 'dark'
    },
})

interface StyleProps {
    opacity: number,
    top: number,
    left: number,
    blur: number
    width: number,
    height: number
}

const useStyles = makeStyles({
    wrapper: {
        width: props => props.width,
        position: 'absolute',
        left: props => props.left,
        top: (props: StyleProps) => props.top,
        overflow: 'hidden',
        background: props => `rgba(20, 20, 20, ${props.opacity})`,
        backdropFilter: props => `blur(${props.blur}px)`,
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"chat"',
        borderRadius: 5,
    },
    hidden: {
        height: '0 !important',
    },
    show: {
        display: 'grid',
        resize: 'both',
        padding: 10,
        minHeight: MinHeight,
        minWidth: MinWidth,
        height: props => props.height,
    },
    control: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    chatList: {
        gridArea: 'chat'
    }
})


const checkFullscreenState = () => document.fullscreenElement !== null

interface IShowAppContext {
    showApp: boolean
}

export const ShowAppContext = createContext<IShowAppContext>({} as IShowAppContext)



export const App: React.FC = () => {

    const { storage: { opacity, top, left, blur, width, height }, storageDispatch } = useContext(StorageContext)
    const { chatList } = useContext(ChatContext)
    const classes = useStyles({ opacity, top, left, blur, width, height })

    const [isFullscreen, setIsFullscreen] = useState<boolean>(checkFullscreenState())

    const showApp = useMemo(() => (isFullscreen && chatList.length > 0), [chatList, isFullscreen])

    const fullscreenChangeListener = () => setIsFullscreen(checkFullscreenState())
    const onMoveEndListener = (x: number, y: number) => { if (isFullscreen) storageDispatch({ type: 'changeOverlayPosition', position: { top: y, left: x } }) }


    useEffect(() => {
        document.addEventListener('fullscreenchange', fullscreenChangeListener)
        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeListener)
        }
    }, [])

    // This mean the youtube page is change to another video page on current tab


    return (

        <ThemeProvider theme={theme}>
            <ShowAppContext.Provider value={{ showApp }}>
                <Motion
                    onMoveEnd={onMoveEndListener}
                    className={`${classes.wrapper} ${showApp ? classes.show : classes.hidden}`}>
                    {/* className={`${classes.wrapper} ${classes.show}`}> */}
                    <ChatList className={classes.chatList} />
                    <Control className={classes.control} />
                </Motion>
            </ShowAppContext.Provider>
        </ThemeProvider>
    )
}

