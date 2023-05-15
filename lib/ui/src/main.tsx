import { Draggable } from './Draggable'
import { render } from 'solid-js/web'
import type { Component } from 'solid-js'

const App: Component = () => {
    return (
        <Draggable>
            <div>hi</div>
        </Draggable>
    )
}

render(() => <App />, document.getElementById('root')!)
