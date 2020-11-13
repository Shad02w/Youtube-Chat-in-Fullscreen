
import { useEffect, useState } from 'react'

export const useElementStatus = (id: string) => {
    const [ready, setReady] = useState<boolean>(document.getElementById(id) ? true : false)

    useEffect(() => {
        const interceptedObserver = new MutationObserver(() => {
            if (document.getElementById(id)) {
                setReady(true)
                interceptedObserver.disconnect()
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => interceptedObserver.disconnect()
    }, [id])

    return { ready }
}

