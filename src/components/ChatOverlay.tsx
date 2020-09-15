import React, { useRef, useContext, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { MinHeight, MinWidth } from '../models/Storage'
import { StorageContext } from './StorageContext'
import { useMovable } from './useMovable'
import { useResizable } from './useResizable'
import { ChatList } from './ChatList'
import { Control } from './Control'
import { AppContext } from './AppContext'

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
        backdropFilter: props => props.blur ? 'none' : `blur(${props.blur}px)`,
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


export const ChatOverlay: React.FC = ({ children }) => {

    const containerRef = useRef<HTMLDivElement>(null)

    const { storage: { opacity, top, left, blur, width, height }, storageDispatch } = useContext(StorageContext)
    const { show } = useContext(AppContext)

    const classes = useStyles({ opacity, top, left, blur, width, height })

    const { id, onMoveEnd, movable } = useMovable(containerRef)
    const { OnResizeEnd } = useResizable(containerRef)



    useEffect(() => {
        if (!containerRef.current) return
        const t = parseInt(containerRef.current.style.top)
        const l = parseInt(containerRef.current.style.left)
        storageDispatch({ type: 'changeOverlayPosition', position: { top: t, left: l } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onMoveEnd])

    useEffect(() => {
        if (!containerRef.current) return
        const w = parseInt(containerRef.current.style.width)
        const h = parseInt(containerRef.current.style.height)
        storageDispatch({ type: 'changeOverlaySize', size: { width: w, height: h } })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OnResizeEnd])
    return (
        <div
            ref={containerRef}
            className={`${classes.wrapper} ${show ? classes.show : classes.hidden} ${movable ? 'noselect' : ''}`}>
            <ChatList className={classes.chatList} />
            <Control className={classes.control} movableTriggerId={id} />
        </div >
    )

}
