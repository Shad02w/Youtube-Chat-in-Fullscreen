
import { useEffect, useState } from 'react'

export const useElementState = (id: string) => {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const interceptedObserver = new MutationObserver(() => {
            if (document.getElementById(id)) {
                setReady(true)
                interceptedObserver.disconnect()
            }
        })
        interceptedObserver.observe(document.body, { childList: true, subtree: true })
        return () => {
            interceptedObserver.disconnect()
        }
    }, [id])

    return { ready }
}


export const useInterceptElementState = <T>(initValue: T, id: string) => {
    const { ready } = useElementState(id)
    const [data, setData] = useState<T>(initValue)

    useEffect(() => {
        if (ready) {
            const interceptedElment = document.getElementById(id) as HTMLDivElement
            const observer = new MutationObserver((mutations) => {
                const childMutation = mutations.find(mutation => mutation.type === 'childList')
                if (!childMutation) return
                const json = JSON.parse((childMutation.target as HTMLDivElement).innerHTML) as T
                setData(json)
            })
            observer.observe(interceptedElment, { childList: true })
            return () => observer.disconnect()
        }
    }, [ready, id])
    return { data }
}

