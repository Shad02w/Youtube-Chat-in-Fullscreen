import { type Component, type JSX } from 'solid-js'
import { createDraggable } from './createDraggable'
import style from './index.module.css'

interface Props {
    class?: string
    children: JSX.Element
}

export const Draggable: Component<Props> = (props) => {
    const { bind, transition } = createDraggable({ initial: [0, 0] })

    return (
        <div class={style.container} style={{ transform: `translate(${transition.x()}px,${transition.y()}px)` }} {...bind()}>
            {props.children}
        </div>
    )
}
