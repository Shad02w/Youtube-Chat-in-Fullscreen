/**
 * This hook will monitor the existence of a element
 */
import { useEffect, useState } from "react"

export type GetElementCallback<K> = <T extends any[]>(...args: T) => K | undefined

export const useMutation = function <T extends Node>(finder: GetElementCallback<T>) {
    const [exist, setExist] = useState(false)
    const [node, setNode] = useState<T | undefined>(finder())

    useEffect(() => {

        const target = finder()
        if (target) {
            setExist(true)
            setNode(target)
        }
        const observer = new MutationObserver(() => {
            const t = finder()
            if (t) {
                setNode(t)
                setExist(true)
            } else {
                setExist(false)
                setNode(undefined)
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [finder])


    return { exist, node }
}