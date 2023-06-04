import { createSignal, type Component } from 'solid-js'
import { URL_MARKER } from '../../util/constant'
import styles from './index.module.css'

interface Props {
    width: number
    height: number
    link: string
}

export const LiveChat: Component<Props> = (props) => {
    const [loaded, setLoaded] = createSignal(false)
    return (
        <div class={styles.container} classList={{ [styles.loaded!]: loaded() }}>
            <div>loading...</div>
            <iframe title='youtube live chat' src={props.link + URL_MARKER} width={props.width} height={props.height} onLoad={() => setLoaded(true)} />
        </div>
    )
}
