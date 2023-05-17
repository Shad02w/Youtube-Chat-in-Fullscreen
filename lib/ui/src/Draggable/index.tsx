import { createEffect, type Component, type JSX } from 'solid-js'
import { createDraggable } from './createDraggable'
import style from './index.module.css'

interface Props {
    class?: string
    children: JSX.Element
}

export const Draggable: Component<Props> = (props) => {
    const { bind, transition } = createDraggable({ initial: [900, 300] })
    let div: HTMLDivElement | undefined

    createEffect(() => {
        const x = transition.x()
        const y = transition.y()
        requestAnimationFrame(() => {
            if (div) {
                div.style.transform = `translate(${x}px,${y}px)`
            }
        })
    })

    return (
        <div ref={div} class={style.container} {...bind()}>
            {props.children}
        </div>
    )
}
