import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

interface Distance {
    x: number,
    y: number
}

type Point = Distance

export function useMovable(ref: React.RefObject<HTMLElement>, onEnded: () => any) {

    const [id] = useState<string>(`A${uuidV4()}`)
    const trigger_id = useMemo(() => id, [id])

    const [movable, setMovable] = useState<boolean>(false)
    const [initPoint, setInitPoint] = useState<Point>({ x: 0, y: 0 })

    const CtrlAltPressed = useRef<boolean>(false)

    const movableRef = useRef<boolean>(false)
    movableRef.current = movable
    const initPointRef = useRef<Point>(initPoint)
    initPointRef.current = initPoint

    const enableMoving = (mouseX: number, mouseY: number) => {
        setMovable(true)
        setInitPoint({ x: mouseX, y: mouseY })
    }

    const disableMoving = () => {
        setMovable(false)
    }

    const moving = ({ pageX: mouseX, pageY: mouseY }: MouseEvent) => {
        if (!movableRef.current || !ref.current) return
        const el = ref.current
        requestAnimationFrame(() => {
            el.style.transform = `translate(${mouseX - initPointRef.current.x}px,${mouseY - initPointRef.current.y}px)`
        })
    }


    const trigger = ({ pageX: mouseX, pageY: mouseY, target }: MouseEvent) => {
        if ((ref.current && (target as HTMLElement).closest(`#${id}`)) || CtrlAltPressed.current)
            enableMoving(mouseX, mouseY)
    }

    const keydownListener = ({ ctrlKey, altKey, repeat }: KeyboardEvent) => {
        if (ctrlKey && altKey && !repeat) {
            CtrlAltPressed.current = true
            document.addEventListener('keyup', () => CtrlAltPressed.current = false, { once: true })
        }
    }

    const deactive = () => {
        disableMoving()
        if (ref.current) {
            const el = ref.current
            const rect = el.getBoundingClientRect()
            requestAnimationFrame(() => {
                el.style.top = rect.top + 'px'
                el.style.left = rect.left + 'px'
                el.style.bottom = 'auto'
                el.style.right = 'auto'
                el.style.transform = `translate(0px,0px)`
                onEnded()
            })
        }
    }


    // when movable is enable
    useEffect(() => {
        if (!movable || !ref.current) return
        document.body.addEventListener('mouseup', deactive, { once: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movable])

    useEffect(() => {
        if (!ref.current) return
        const el = ref.current
        //button trigger
        el.addEventListener('mousedown', trigger)

        // ctrl keydown trigger
        document.addEventListener('keydown', keydownListener)

        document.body.addEventListener('mousemove', moving)

        return () => {
            el.removeEventListener('mousedown', trigger)
            document.body.removeEventListener('mousemove', moving)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])

    return { id: trigger_id, movable }

}

