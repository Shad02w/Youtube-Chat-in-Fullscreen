import type { Component } from 'solid-js'
import './index.css'
import { LiveChat } from './LiveChat'

interface Props {
    liveChatUrl: string
}

export const App: Component<Props> = (props) => {
    return <LiveChat link={props.liveChatUrl} />
}
