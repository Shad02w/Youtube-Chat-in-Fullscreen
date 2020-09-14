import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

interface Distance {
    x: number,
    y: number
}

// const MovalbeTriggerId = 'movable-trigger-element'

export function useMovable(ref: React.RefObject<HTMLElement>) {

    const [id] = useState<string>(uuidV4())
    const trigger_id = useMemo(() => id, [id])

    const [initialDistance, setInitialDistance] = useState<Distance>({ x: 0, y: 0 })
    const [movable, setMovable] = useState<boolean>(false)

    const movableRef = useRef<boolean>(movable)
    const initialDistanceRef = useRef<Distance>(initialDistance)
    initialDistanceRef.current = initialDistance

    const moving = ({ pageX: mouseX, pageY: mouseY }: MouseEvent) => {
        if (!movableRef.current || !ref.current) return
        const el = ref.current
        el.style.left = `${mouseX - initialDistanceRef.current.x}px`
        el.style.top = `${mouseY - initialDistanceRef.current.y}px`
        el.style.right = `auto`
        el.style.bottom = `auto`
    }


    const Trigger = ({ pageX: mouseX, pageY: mouseY, target }: MouseEvent) => {
        if (!ref.current || !(target as HTMLElement).closest(`#${id}`)) return
        const rect = ref.current.getBoundingClientRect()
        setMovable(true)
        setInitialDistance({ x: mouseX - rect.x, y: mouseY - rect.y })
    }

    const deactive = () => {
        setMovable(false)
        // if (props.onMoveEnd && containerRef.current) {
        //     const el = containerRef.current
        //     const rect = el.getBoundingClientRect()
        //     props.onMoveEnd(rect.x, rect.y)
        // }
    }

    useEffect(() => {

    }, [ref])

    useEffect(() => {
        if (!movable || !ref.current) return
        const el = ref.current
        el.addEventListener('mouseup', deactive, { once: true })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movable])


    useEffect(() => {
        if (!ref.current) return
        const el = ref.current
        el.addEventListener('mousedown', Trigger)
        document.body.addEventListener('mousemove', moving)

        return () => {
            document.body.removeEventListener('mousemove', moving)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])

    return { id: trigger_id }

}

