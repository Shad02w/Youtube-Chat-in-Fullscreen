import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

interface Distance {
    x: number,
    y: number
}


const useOnEventEnd = () => {
    const [count, setCount] = useState<number>(0)
    const set = () => setCount(pre => pre + 1)
    return { onMoveEnd: count, setOnMoveEnd: set }
}

export function useMovable(ref: React.RefObject<HTMLElement>) {

    const [id] = useState<string>(`A${uuidV4()}`)
    const trigger_id = useMemo(() => id, [id])

    const [initialDistance, setInitialDistance] = useState<Distance>({ x: 0, y: 0 })
    const [movable, setMovable] = useState<boolean>(false)
    const { onMoveEnd, setOnMoveEnd } = useOnEventEnd()

    const movableRef = useRef<boolean>(movable)
    const initialDistanceRef = useRef<Distance>(initialDistance)
    initialDistanceRef.current = initialDistance
    movableRef.current = movable

    const moving = ({ pageX: mouseX, pageY: mouseY }: MouseEvent) => {
        if (!movableRef.current || !ref.current) return
        // console.log('moving')
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
        setOnMoveEnd()
    }

    useEffect(() => {
        if (!movable || !ref.current) return
        document.body.addEventListener('mouseup', deactive, { once: true })

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

    return { id: trigger_id, onMoveEnd, movable }

}

