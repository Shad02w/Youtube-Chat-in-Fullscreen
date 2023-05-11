import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'

function App() {
    const [count, setCount] = createSignal(0)
    return <button onClick={() => setCount((_) => _ + 1)}>add count: {count()}</button>
}
