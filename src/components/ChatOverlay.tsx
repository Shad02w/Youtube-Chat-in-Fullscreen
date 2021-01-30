import React, { useContext, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Color, MinHeight, MinWidth } from '../models/Storage'
import { StorageContext } from '../contexts/StorageContext'
import { ChatContextProvider } from '../contexts/ChatContext'
import { ToolBar } from './Toolbar'
import { Moving } from './Moving'
import { useCtrlAltHotKey } from './hooks/useHotkeys'
import { ReformedChat } from './ReformedChat'
import { AppContext } from '@contexts/AppContext'
import { NativeChat } from './NativeChat'
import { Position } from '@models/Interact'
import { Dragable, DragEndCallbackValue } from './Dragable'
import { Resizable, ResizeCallbackValue, ResizeEndCallbackValue, ResizeStartCallbackValue } from './Resizeable'

interface StyleProps {
    opacity: number,
    blur: number
    color: Color
    bgColor: Color
}

const useStyles = makeStyles({
    wrapper: {
        overflow: 'hidden',
        color: ({ color }: StyleProps) => `rgb(${color.r}, ${color.g}, ${color.r})`,
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
        // height: '0 !important',
        display: 'none',
    },
    show: {
        display: 'block',
    },
    resizable: {
        display: 'grid',
        minHeight: MinHeight,
        minWidth: MinWidth,
    },
    chatList: {
        gridArea: 'chat'
    }
})


export const ChatOverlay: React.FC = () => {


    const { storage, storageDispatch } = useContext(StorageContext)
    const { opacity, size: { width, height }, position, blur, backgroundColor: bgColor, color, native } = storage
    const { showOverlay } = useContext(AppContext)

    const classes = useStyles({ opacity, blur, bgColor, color })
    const id = 'triggerIdForChatOverlay'
    const [movable, setMovable] = useState(false)
    const [resizalbePosition, setResizeablePosition] = useState<Partial<Position>>({ top: 0, left: 0 })

    useCtrlAltHotKey('c', onHotkeyPressed)

    function onHotkeyPressed() {
        storageDispatch({ type: 'toggleOverlay' })
    }

    const handleDragEnd = (value?: DragEndCallbackValue) => {
        setMovable(false)
        if (!value) return
        storageDispatch({ type: 'changeOverlayPosition', position: { top: value.top, left: value.left } })
    }

    const handleResizeStart = (value: ResizeStartCallbackValue) => {
        setResizeablePosition(value.position)
    }

    const handleResize = (value: ResizeCallbackValue) => {
        storageDispatch({ type: 'changeOverlaySize', size: value.size })
    }

    const handleResizeEnd = (value: ResizeEndCallbackValue) => {
        storageDispatch({ type: 'changeOverlaySize', size: value.size })
        setResizeablePosition(value.position)
    }

    return (
        <Dragable
            top={position.top}
            left={position.left}
            triggerId={id}
            onDragStart={() => setMovable(true)}
            onDragEnd={handleDragEnd}
            className={`${showOverlay ? classes.show : classes.hidden}`}
        >
            <Resizable
                size={{ width, height }}
                position={resizalbePosition}
                className={`${classes.wrapper} ${classes.resizable}  ${movable ? 'noselect' : ''} ${blur > 0 ? classes.blur : ''}`}
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeEnd={handleResizeEnd}
            >
                {
                    native ?
                        <NativeChat />
                        :
                        <ChatContextProvider>
                            {
                                movable ?
                                    <Moving className={classes.chatList} />
                                    :
                                    <ReformedChat className={classes.chatList} />
                            }
                        </ChatContextProvider>
                }
                <ToolBar
                    movableTriggerId={id}
                />
            </Resizable >
        </Dragable>
    )
}
