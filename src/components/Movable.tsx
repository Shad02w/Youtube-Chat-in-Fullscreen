import React, { useState, createContext, useRef, HTMLAttributes, DetailedHTMLProps, useEffect, Children } from 'react'


interface IMovableProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

interface Distance {
    x: number,
    y: number
}

const MovalbeTriggerId = 'movable-trigger-element'


export const Movable: React.FC<IMovableProps> = (props) => {

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
        if ((target as HTMLDivElement).id !== MovalbeTriggerId || !containerRef.current) return
        console.log('trigger')
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        setMovable(true)
        setInitialDistance({ x: mouseX - rect.x, y: mouseY - rect.y })
    }


    useEffect(() => {
        document.addEventListener('mousemove', onMouseMovingListener)
        return () => {
            document.removeEventListener('mousemove', onMouseMovingListener)
        }
    }, [])

    useEffect(() => {
        if (!movable || !containerRef.current) return
        document.addEventListener('mouseup', () => setMovable(false))
    }, [movable])



    return (
        <div {...props}
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


