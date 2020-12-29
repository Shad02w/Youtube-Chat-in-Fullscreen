
import { useEffect, useState } from 'react'

type GetElementCallback = <T extends any[]>(...args: T) => Node | undefined

export const useElementState = (getElementCallback: GetElementCallback) => {
    const [ready, setReady] = useState<boolean>(getElementCallback() ? true : false)
    const [node, setNode] = useState<Node | undefined>(getElementCallback() ? getElementCallback() : undefined)

    useEffect(() => {
        const interceptedObserver = new MutationObserver((m) => {
            const el = getElementCallback()
            if (el) {
                setReady(true)
                setNode(el)
            }
            else {
                setReady(false)
                setNode(undefined)
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => interceptedObserver.disconnect()
    }, [getElementCallback, ready])

    return { ready, node }
}

