import { createEffect, type Component, type JSX } from 'solid-js'
import { createDraggable } from './createDraggable'
import classNames from 'classnames'

interface Props {
    class?: string
    triggerId?: string
    children: JSX.Element
    onDragStart?: () => void
    onDragEnd?: () => void
}

export const Draggable: Component<Props> = (props) => {
    const { bind, transition } = createDraggable({ initial: [0, 0], triggerId: props.triggerId, onDragStart: props.onDragStart, onDragEnd: props.onDragEnd })
    let div: HTMLDivElement | undefined

    createEffect(() => {
        const x = transition.x()
        const y = transition.y()
        requestAnimationFrame(() => {
            if (div) {
                div.style.transform = `translate3d(${x}px,${y}px,0px)`
            }
        })
    })

    const classes = () => classNames('ycf-draggable', props.class)

    return (
        <div ref={div} class={classes()} {...bind()}>
            {props.children}
        </div>
    )
}
