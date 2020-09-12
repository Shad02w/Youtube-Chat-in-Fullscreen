import React, { useState, useRef, HTMLAttributes, DetailedHTMLProps, useEffect, useContext } from 'react'
import { debounce } from '../models/Function'
import { StorageContext } from './StorageContext'
import { MinHeight, MinWidth } from '../models/Storage'


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
    const { storageDispatch } = useContext(StorageContext)
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

        const Resize: (width: number, height: number) => void = debounce(150, function () {
            if (!arguments || !arguments[0] || !arguments[1]) return
            const width = arguments[0]
            const height = arguments[1]
            console.log('width', width, 'height', height)
            storageDispatch({
                type: 'changeOverlaySize',
                size: {
                    width: (width < MinWidth) ? MinWidth : width,
                    height: (height < MinHeight) ? MinHeight : height,
                }
            })
        })

        const containerObserver = new MutationObserver((mutaions, observer) => {
            const attributesMutation = mutaions.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'style')
            if (!attributesMutation) return
            // console.log('attributesMutations', attributesMutation, 'style.width', (attributesMutation.target as HTMLDivElement).style)
            const target = attributesMutation.target as HTMLDivElement
            const width = parseInt(target.style.width),
                height = parseInt(target.style.height)
            Resize(width, height)
        })
        containerObserver.observe(containerRef.current, { childList: true, attributes: true })
        return () => containerObserver.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
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


