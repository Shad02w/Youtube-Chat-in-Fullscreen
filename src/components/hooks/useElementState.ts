
import { useEffect, useState } from 'react'

export const useElementStatus = (id: string) => {
    const [ready, setReady] = useState<boolean>(document.getElementById(id) ? true : false)

    useEffect(() => {
        const interceptedObserver = new MutationObserver((m) => {
            if (document.getElementById(id)) {
                if (!ready) setReady(true)
            }
            else {
                if (ready) setReady(false)
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => interceptedObserver.disconnect()
    }, [id, ready])

    return { ready }
}

