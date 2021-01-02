/**
 * This hook will monitor the existence of a element
 */
import { useEffect, useState } from "react"

export type GetElementCallback<K> = <T extends any[]>(...args: T) => K | undefined

export const useMutation = function <T>(finder: GetElementCallback<T>) {
    const [exist, setExist] = useState(false)
    const [target, setTarget] = useState<T | undefined>(finder())

    useEffect(() => {

        const found = finder()
        if (found) {
            setExist(true)
            setTarget(found)
        }
        const observer = new MutationObserver(() => {
            const f = finder()
            if (f) {
                setTarget(f)
                setExist(true)
            } else {
                setExist(false)
                setTarget(undefined)
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [finder])


    return { exist, target }
}