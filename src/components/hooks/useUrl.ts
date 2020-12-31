import { useEffect, useRef } from "react"

export const useUrl = (onChange: (location: Location) => any) => {

    const previousehref = useRef('')
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (previousehref.current !== window.location.href) {
                previousehref.current = window.location.href
                onChangeRef.current(window.location)
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [])
}