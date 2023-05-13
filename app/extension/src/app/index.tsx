import { Component } from 'solid-js'
import './index.css'

export const App: Component = () => {
    return (
        <>
            <button class='_ycf_app' onClick={() => alert('click solid js')}>
                App
            </button>
            <iframe
                title='youtube chat'
                src='https://www.youtube.com/live_chat?is_popout=1&v=jfKfPfyJRdk&ycf=_self'
                width='400'
                height='600'
            />
        </>
    )
}
