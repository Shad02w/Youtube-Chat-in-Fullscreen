import { createEffect, type Component, type JSX } from 'solid-js'
import { createDraggable, type Options } from './createDraggable'
import classNames from 'classnames'

interface Props extends Options {
    class?: string
    children: JSX.Element
}

export const Draggable: Component<Props> = (props) => {
    const { bind, transition } = createDraggable({
        initial: props.initial,
        triggerId: props.triggerId,
        onDragStart: props.onDragStart,
        onDragEnd: props.onDragEnd
    })
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
