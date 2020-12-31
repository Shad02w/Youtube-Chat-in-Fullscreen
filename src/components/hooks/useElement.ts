/**
 * This hook will monitor the existence of a element
 */
import { useEffect, useState } from "react"

export type GetElementCallback<NodeType extends Node> = <T extends any[]>(...args: T) => NodeType | undefined

export const useElement = function <NodeType extends Node>(finder: GetElementCallback<NodeType>) {
    const [exist, setExist] = useState(false)
    const [node, setNode] = useState<NodeType | undefined>(finder())

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