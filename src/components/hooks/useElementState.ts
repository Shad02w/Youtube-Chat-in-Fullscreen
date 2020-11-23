
import { useEffect, useState } from 'react'

type getElementCallback = <T extends any[]>(...args: T) => Node | undefined

export const useElementState = (getElementCallback: getElementCallback) => {
    const [ready, setReady] = useState<boolean>(getElementCallback() ? true : false)

    useEffect(() => {
        const interceptedObserver = new MutationObserver((m) => {
            if (getElementCallback()) {
                if (!ready) setReady(true)
            }
            else {
                if (ready) setReady(false)
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => interceptedObserver.disconnect()
    }, [getElementCallback, ready])

    return { ready }
}

