import { batch, createSignal } from 'solid-js'

export type Options = {
    triggerId?: string
    initial: [number, number]
    onDragStart?: () => void
    onDragEnd?: (cord: [number, number]) => void
}

export function createDraggable(options: Options) {
    let start: [number, number] | null = null
    let previous: [number, number] = options.initial
    const [x, setX] = createSignal<number>(options.initial[0])
    const [y, setY] = createSignal<number>(options.initial[0])

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

    const triggeredById = (e: MouseEvent): boolean => {
        if (!options.triggerId) return true

        const el = e.target as HTMLElement
        if (!('closest' in el)) return true

        return el.closest(`#${options.triggerId}`) !== null
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
        options.onDragEnd?.([total[0], total[1]])
    }

    const bind = () => ({
        onMouseDown: (e: MouseEvent) => {
            if (start || !triggeredById(e) || e.buttons !== 1) return
            start = [e.clientX, e.clientY]
            previous = [x(), y()]
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
            options.onDragStart?.()
        }
    })

    return {
        transition: { x, y },
        bind
    }
}
