import React, { useRef, useContext, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { MinHeight, MinWidth } from '../models/Storage'
import { StorageContext } from '../contexts/StorageContext'
import { useMovable } from '../hooks/useMovable'
import { useResizable } from '../hooks/useResizable'
import { useFullscreenState } from '../hooks/useFullscreenState'
import { AppContext } from '../contexts/AppContext'
import { ChatList } from './ChatList'
import { ToolBar } from './Toolbar'
import { Moving } from './Moving'
import { useCtrlAltHotKey } from '../hooks/useHotkeys'

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
        backdropFilter: props => (props.blur > 0) ? `blur(${props.blur}px)` : 'none',
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"chat"',
        borderRadius: 5,
        zIndex: 10
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


export const ChatOverlay: React.FC = () => {

    const containerRef = useRef<HTMLDivElement>(null)


    const { storage, storageDispatch } = useContext(StorageContext)
    const { opacity, fontSize, top, left, blur, width, height, show: showOverlay } = storage
    const { chatActions, pageType } = useContext(AppContext)

    const { isFullscreen } = useFullscreenState()
    const show = useMemo(() => (showOverlay && isFullscreen && pageType !== 'normal'), [showOverlay, isFullscreen, pageType])

    const classes = useStyles({ opacity, top, left, blur, width, height })

    const { id, movable } = useMovable(containerRef, onMoveEnd)
    useResizable(containerRef, onResizeEnd)
    useCtrlAltHotKey('c', onHotkeyPressed)


    function onMoveEnd() {
        if (!containerRef.current) return
        const t = parseInt(containerRef.current.style.top)
        const l = parseInt(containerRef.current.style.left)
        storageDispatch({ type: 'changeOverlayPosition', position: { top: t, left: l } })
    }

    function onResizeEnd() {
        if (!containerRef.current) return
        const w = parseInt(containerRef.current.style.width)
        const h = parseInt(containerRef.current.style.height)
        storageDispatch({ type: 'changeOverlaySize', size: { width: w, height: h } })
    }

    function onHotkeyPressed() {
        storageDispatch({ type: 'toggleOverlay' })
    }

    return (
        <div
            ref={containerRef}
            className={`${classes.wrapper} ${show ? classes.show : classes.hidden} ${movable ? 'noselect' : ''}`}>
            {/* className={`${classes.wrapper} ${classes.show} ${movable ? 'noselect' : ''}`}> */}
            {
                movable ?
                    <Moving className={classes.chatList} />
                    :
                    <ChatList
                        chatActions={chatActions}
                        fontSize={fontSize}
                        className={classes.chatList} />

            }
            <ToolBar className={classes.control}
                movableTriggerId={id} />
        </div >
    )

}
