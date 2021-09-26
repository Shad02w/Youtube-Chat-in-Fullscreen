import React, { PropsWithChildren, useCallback, useEffect, useState, useRef } from 'react'
import { Distance, Point } from '@models/Interact'
import { createStyles, makeStyles } from '@material-ui/core/styles'

export interface DragMoveCallbackValue {
    distance: Distance
    start: Point
    current: Point
}

export interface DragEndCallbackValue {
    top: number
    left: number
}

interface DraggableProps {
    className?: string
    triggerId?: string
    x?: boolean
    y?: boolean
    move?: boolean
    top?: number
    left?: number
    onDragMove?: (value: DragMoveCallbackValue) => any
    onDragStart?: () => any
    onDragEnd?: (value?: DragEndCallbackValue) => any
}

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            position: 'absolute'
        }
    })
)

export const Draggable: React.FC<PropsWithChildren<DraggableProps>> = props => {
    const { children, className, triggerId, x, y, onDragMove, onDragStart, onDragEnd, move, top, left } = props
    const [start, setStart] = useState<Point>({ x: 0, y: 0 })
    const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const draggableRef = useRef<HTMLDivElement | null>(null)
    const classes = useStyles()

    useEffect(() => {
        if (!draggableRef.current) return
        const el = draggableRef.current
        requestAnimationFrame(() => {
            el.style.top = `${top}px`
            el.style.left = `${left}px`
        })
    }, [top, left])

    const moving = useCallback(
        ({ pageX, pageY }: MouseEvent) => {
            if (!dragging) return
            const distance: Distance = {
                x: x !== false ? pageX - start.x : 0,
                y: y !== false ? pageY - start.y : 0
            }
            setTranslate(distance)
            onDragMove?.({ distance, current: { x: pageX, y: pageY }, start })
        },
        [start, dragging, x, y, onDragMove]
    )

    const trigger = ({ pageX, pageY, target }: React.MouseEvent<HTMLElement>) => {
        if (!draggableRef.current) return
        if (triggerId && !(target as HTMLElement).closest(`#${triggerId}`)) return
        setStart({ x: pageX, y: pageY })
        setDragging(true)
        onDragStart?.()
    }

    const deactivate = useCallback(() => {
        if (!dragging) return
        const trans = Object.assign({}, translate)
        setDragging(false)
        setTranslate({ x: 0, y: 0 })
        onDragEnd?.()

        if (move !== false) {
            if (!document.defaultView || !draggableRef.current) return
            const draggable = draggableRef.current
            const styles = document.defaultView.getComputedStyle(draggable)
            if (!styles) return
            const { top: t, left: l } = styles
            const newTop = parseInt(t) + trans.y
            const newLeft = parseInt(l) + trans.x
            if (onDragEnd) onDragEnd({ top: newTop, left: newLeft })
        }
    }, [draggableRef, translate, dragging, onDragEnd, move])

    useEffect(() => {
        if (dragging) {
            document.body.addEventListener('mousemove', moving)
            document.body.addEventListener('mouseup', deactivate)
            return () => {
                document.body.removeEventListener('mousemove', moving)
                document.body.removeEventListener('mouseup', deactivate)
            }
        }
    }, [dragging, moving, deactivate])

    return (
        <div
            style={{
                transform: move !== false ? `translate(${translate.x}px, ${translate.y}px)` : undefined
            }}
            className={`${className} ${classes.container}`}
            onMouseDown={trigger}
            ref={draggableRef}
        >
            {children}
        </div>
    )
}
