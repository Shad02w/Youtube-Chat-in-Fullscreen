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
        <Draggable triggerId='button'>
            <div>hi</div>
            <TriggerButton />
        </Draggable>
    )
}

render(() => <App />, document.getElementById('root')!)
