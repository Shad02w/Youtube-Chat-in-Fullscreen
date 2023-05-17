import { batch, createSignal } from 'solid-js'

export interface Options {
    initial: [number, number]
}

export function createDraggable({ initial }: Options) {
    let start: [number, number] | null = null
    let previous: [number, number] = initial
    const [x, setX] = createSignal<number>(initial[0])
    const [y, setY] = createSignal<number>(initial[0])

    const setTransition = (x: number, y: number) => {
        batch(() => {
            setX(x)
            setY(y)
        })
    }

    const calculateTotalTransition = (e: MouseEvent): [number, number] => {
        if (!start) return previous
        const delta: [number, number] = [e.clientX - start[0], e.clientY - start[1]]
        return [previous[0] + delta[0], previous[1] + delta[1]]
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!start) return
        const total = calculateTotalTransition(e)
        setTransition(total[0], total[1])
    }

    const onMouseUp = (e: MouseEvent) => {
        if (!start) return
        const total = calculateTotalTransition(e)
        setTransition(total[0], total[1])

        start = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    const bind = () => ({
        onMouseDown: (e: MouseEvent) => {
            if (start) return
            start = [e.clientX, e.clientY]
            previous = [x(), y()]
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        }
    })

    return {
        transition: { x, y },
        bind
    }
}
