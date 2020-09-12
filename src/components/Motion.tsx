import React, { useState, useRef, HTMLAttributes, DetailedHTMLProps, useEffect } from 'react'


interface IMotionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onMoveEnd?: (x: number, y: number) => void
}

interface Distance {
    x: number,
    y: number
}

const MovalbeTriggerId = 'movable-trigger-element'


export const Motion: React.FC<IMotionProps> = (props) => {

    const [initialDistance, setInitialDistance] = useState<Distance>({ x: 0, y: 0 })
    const [movable, setMovable] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const movableRef = useRef<boolean>(movable)
    const initialDistanceRef = useRef<Distance>(initialDistance)

    movableRef.current = movable
    initialDistanceRef.current = initialDistance


    const onMouseMovingListener = ({ pageX: mouseX, pageY: mouseY }: MouseEvent) => {
        if (!movableRef.current || !containerRef.current) return
        const container = containerRef.current
        container.style.left = `${mouseX - initialDistanceRef.current.x}px`
        container.style.top = `${mouseY - initialDistanceRef.current.y}px`
        container.style.right = `auto`
        container.style.bottom = `auto`
    }

    const onMouseDownListener = ({ pageX: mouseX, pageY: mouseY, target }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!(target as HTMLElement).closest(`#${MovalbeTriggerId}`) || !containerRef.current) return
        console.log('trigger')
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        setMovable(true)
        setInitialDistance({ x: mouseX - rect.x, y: mouseY - rect.y })
    }

    const onMouseUpListener = () => {
        setMovable(false)
        if (props.onMoveEnd && containerRef.current) {
            const el = containerRef.current
            const rect = el.getBoundingClientRect()
            props.onMoveEnd(rect.x, rect.y)
        }
    }


    useEffect(() => {
        document.addEventListener('mousemove', onMouseMovingListener)
        return () => {
            document.removeEventListener('mousemove', onMouseMovingListener)
        }
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

    }, [containerRef])

    useEffect(() => {
        if (!movable || !containerRef.current) return
        document.addEventListener('mouseup', onMouseUpListener, { once: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movable])


    const { onMoveEnd, ...filteredProps } = props

    return (
        <div
            {...filteredProps}
            onMouseDown={onMouseDownListener}
            ref={containerRef}
            className={`${props.className || ''} ${movable ? 'noselect' : ''}`}>
            {props.children}
        </div>
    )
}


interface IMovableTrigger extends React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

export const MovableTrigger: React.FC<IMovableTrigger> = (props) => {
    return (
        <div {...props} id={MovalbeTriggerId}>
            {props.children}
        </div>
    )
}


