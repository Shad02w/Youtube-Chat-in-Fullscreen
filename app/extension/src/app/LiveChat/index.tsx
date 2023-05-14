import type { Component } from 'solid-js'
import style from './index.module.css'
import { URL_MARKER } from '../../util/constant'

interface Props {
    link: string
}

export const LiveChat: Component<Props> = (props) => {
    return (
        <div class={style.container}>
            <iframe
                title='youtube chat'
                // src='https://www.youtube.com/live_chat?is_popout=1&v=jfKfPfyJRdk&ycf=_self'
                src={props.link + URL_MARKER}
                width='400'
                height='600'
            />
        </div>
    )
}
