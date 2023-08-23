import { Draggable } from './Draggable'
import { render } from 'solid-js/web'
import { createSignal, type Component } from 'solid-js'

export const TriggerButton: Component = () => {
    const [count, setCount] = createSignal(0)
    return (
        <button id='button' onClick={() => setCount((_) => _ + 1)}>
            Count: {count()}
        </button>
    )
}

const App: Component = () => {
    return (
        <Draggable initial={[0, 0]} triggerId='button'>
            <iframe title='youtube chat' src='https://bun.sh/' width='400' height='600' />
            <TriggerButton />
        </Draggable>
    )
}

render(() => <App />, document.getElementById('root')!)