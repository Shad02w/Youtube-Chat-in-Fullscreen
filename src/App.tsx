import React, { useState, useEffect, createContext, useMemo, useContext, useRef } from 'react'

import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { ChatContext } from './components/ChatContext'
import './css/App.css'
import { StorageContext } from './components/StorageContext'
import { ChatList } from './components/ChatList'
import { Control } from './components/Control'
import { MinHeight, MinWidth } from './models/Storage'
import { useMovable } from './components/useMovable'
import { useResizable } from './components/useResizable'




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

    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(checkFullscreenState())


    const { storage: { opacity, top, left, blur, width, height }, storageDispatch } = useContext(StorageContext)
    const { chatList } = useContext(ChatContext)

    const classes = useStyles({ opacity, top, left, blur, width, height })

    const { id, onMoveEnd, movable } = useMovable(containerRef)
    useResizable(containerRef, (w, h) => storageDispatch({ type: 'changeOverlaySize', size: { width: w, height: h } }))
    const showApp = useMemo(() => (isFullscreen && chatList.length > 0), [chatList, isFullscreen])

    const fullscreenChangeListener = () => setIsFullscreen(checkFullscreenState())


    useEffect(() => {
        document.addEventListener('fullscreenchange', fullscreenChangeListener)
        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeListener)
        }
    }, [])

    useEffect(() => {
        if (!containerRef.current) return
        const t = parseInt(containerRef.current.style.top)
        const l = parseInt(containerRef.current.style.left)
        storageDispatch({ type: 'changeOverlayPosition', position: { top: t, left: l } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onMoveEnd])


    return (

        <ThemeProvider theme={theme}>
            <ShowAppContext.Provider value={{ showApp }}>
                <div
                    ref={containerRef}
                    className={`${classes.wrapper} ${showApp ? classes.show : classes.hidden} ${movable ? 'noselect' : ''}`}>
                    {/* className={`${classes.wrapper} ${classes.show} ${movable ? 'noselect' : ''}`}> */}
                    <ChatList className={classes.chatList} />
                    <Control className={classes.control} movableTriggerId={id} />
                </div>
            </ShowAppContext.Provider>
        </ThemeProvider>
    )
}
