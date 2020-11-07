import { useEffect } from "react"
import { useElementState } from "./useElementState"

export const useInterceptElementEffect = <T>(effect: (data: T) => any, id: string) => {
    const { ready } = useElementState(id)

    useEffect(() => {
        if (ready) {
            const interceptedElment = document.getElementById(id) as HTMLDivElement
            const observer = new MutationObserver((mutations) => {
                const childMutation = mutations.find(mutation => mutation.type === 'childList')
                if (!childMutation) return
                const data = JSON.parse((childMutation.target as HTMLDivElement).innerHTML) as T
                effect(data)
            })
            observer.observe(interceptedElment, { childList: true })
            return () => observer.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, effect])
}