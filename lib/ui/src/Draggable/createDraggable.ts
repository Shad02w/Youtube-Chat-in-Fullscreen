import { batch, createSignal } from 'solid-js'

export interface Options {
    initial: [number, number]
}

export function createDraggable({ initial }: Options) {
    let start: [number, number] | null = null
    const [x, setX] = createSignal<number>(initial[0])
    const [y, setY] = createSignal<number>(initial[0])

    const setTransition = (x: number, y: number) => {
        batch(() => {
            setX(x)
            setY(y)
        })
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!start) return
        setTransition(e.clientX - start[0], e.clientY - start[1])
    }

    const onMouseUp = (e: MouseEvent) => {
        if (!start) return
        setTransition(e.clientX - start[0], e.clientY - start[1])
        start = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    const bind = () => ({
        onMouseDown: (e: MouseEvent) => {
            if (start) return
            start = [e.clientX, e.clientY]
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        }
    })

    return {
        transition: { x, y },
        bind
    }
}
