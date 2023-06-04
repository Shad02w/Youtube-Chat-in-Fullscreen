import { LiveChat } from './LiveChat'
import { Draggable } from '@ycf/ui/Draggable'
import { createSignal, type Component } from 'solid-js'
import styles from './index.module.scss'
import './global.scss'

interface Props {
    liveChatUrl: string
}

const TRIGGER_ID = 'ycf-button'

export const Overlay: Component<Props> = (props) => {
    const [moving, setMoving] = createSignal(false)

    return (
        <Draggable class={styles.container} initial={[0, 0]} triggerId={TRIGGER_ID} onDragStart={() => setMoving(true)} onDragEnd={() => setMoving(false)}>
            <div class={styles.movingContainer} classList={{ moving: moving() }}>
                <LiveChat link={props.liveChatUrl} width={400} height={600} />
                <p class={styles.movingMessage}>Drag to Move</p>
            </div>
            <button id={TRIGGER_ID}>hi</button>
        </Draggable>
    )
}
