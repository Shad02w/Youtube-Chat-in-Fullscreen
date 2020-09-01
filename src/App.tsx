import React from 'react'


const wrapper: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0
}

const container: React.CSSProperties = {
    position: 'absolute',
    top: 100,
    left: 200,
    background: 'black',
    width: 300,
    height: 400,
}

export const App = () => {
    return (
        <div style={wrapper}>
            <div style={container}>
            </div>
        </div>
    )

}
