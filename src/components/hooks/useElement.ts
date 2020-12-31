/**
 * This hook will monitor the existence of a element
 */
import { useEffect, useState } from "react"

export type GetElementCallback<K> = <T extends any[]>(...args: T) => K | undefined

export const useElement = function <T extends Node>(finder: GetElementCallback<T>) {
    const [exist, setExist] = useState(false)
    const [node, setNode] = useState<T | undefined>(finder())

    useEffect(() => {

        const element = finder()
        if (element) {
            setExist(true)
            setNode(element)
        }
        const observer = new MutationObserver(() => {
            const el = finder()
            if (el) {
                setNode(el)
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