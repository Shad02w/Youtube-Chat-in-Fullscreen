import React, { useRef, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Color, MinHeight, MinWidth } from '../models/Storage'
import { StorageContext } from '../contexts/StorageContext'
import { useMovable } from './hooks/useMovable'
import { useResizable } from './hooks/useResizable'
import { ChatContextProvider } from '../contexts/ChatContext'
import { ToolBar } from './Toolbar'
import { Moving } from './Moving'
import { useCtrlAltHotKey } from './hooks/useHotkeys'
import { ReformedChat } from './ReformedChat'
import { AppContext } from '@contexts/AppContext'

interface StyleProps {
    opacity: number,
    top: number,
    left: number,
    blur: number
    width: number,
    height: number
    color: Color
    bgColor: Color
}

const useStyles = makeStyles({
    wrapper: {
        width: props => props.width,
        position: 'absolute',
        left: props => props.left,
        top: (props: StyleProps) => props.top,
        overflow: 'hidden',
        //TODO: change background using setting modal
        color: ({ color }) => `rgb(${color.r}, ${color.g}, ${color.r})`,
        background: ({ opacity, bgColor }) => `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${opacity})`,
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"chat"',
        borderRadius: 5,
        zIndex: 10
    },
    blur: {
        backdropFilter: props => (props.blur > 0) ? `blur(${props.blur}px)` : 'none',
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
        top: 0,
        right: 0
    },
    chatList: {
        gridArea: 'chat'
    }
})


export const ChatOverlay: React.FC = () => {

    const containerRef = useRef<HTMLDivElement>(null)

    const { storage, storageDispatch } = useContext(StorageContext)
    const { opacity, top, left, blur, width, height, backgroundColor: bgColor, color } = storage
    const { showOverlay } = useContext(AppContext)

    const classes = useStyles({ opacity, top, left, blur, width, height, bgColor, color })

    const { id, movable } = useMovable(containerRef, onMoveEnd)
    useResizable(containerRef, onResizeEnd)
    useCtrlAltHotKey('c', onHotkeyPressed)


    function onMoveEnd() {
        if (!containerRef.current) return
        const t = parseInt(containerRef.current.style.top)
        const l = parseInt(containerRef.current.style.left)
        if (!t || !l) return
        storageDispatch({ type: 'changeOverlayPosition', position: { top: t, left: l } })
    }

    function onResizeEnd() {
        if (!containerRef.current) return
        const w = parseInt(containerRef.current.style.width)
        const h = parseInt(containerRef.current.style.height)
        if (!w || !h) return
        storageDispatch({ type: 'changeOverlaySize', size: { width: w, height: h } })
    }

    function onHotkeyPressed() {
        storageDispatch({ type: 'toggleOverlay' })
    }

    return (
        <div
            ref={containerRef}
            className={`${classes.wrapper} ${showOverlay ? classes.show : classes.hidden} ${movable ? 'noselect' : ''} ${blur > 0 ? classes.blur : ''}`}>
            {
                movable ?
                    <Moving className={classes.chatList} />
                    :
                    <ChatContextProvider>
                        <ReformedChat className={classes.chatList} />
                    </ChatContextProvider>
            }
            <ToolBar className={classes.control}
                movableTriggerId={id}
            />
        </div >
    )

}
