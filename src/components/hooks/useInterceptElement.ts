import { getInterceptElementContent } from "@models/Intercept"
import { useEffect, useState } from "react"
import { useElementState } from "./useElementState"



export const useInterceptElement = <T>(id: string, defaultValue: T) => {

    const getInterceptElement = () => {
        const ie = document.getElementById(id)
        return ie ? ie : undefined
    }

    const { ready } = useElementState(getInterceptElement)
    const [data, setData] = useState<T>(document.getElementById(id) ? getInterceptElementContent(document.getElementById(id)!) : defaultValue)

    useEffect(() => {
        if (ready) {
            const interceptedElment = document.getElementById(id) as HTMLDivElement
            const observer = new MutationObserver(() => {
                const json = getInterceptElementContent(interceptedElment) as T
                setData(json)
            })
            observer.observe(interceptedElment, { childList: true })
            return () => observer.disconnect()
        }
    }, [ready, id])

    return { data, ready }
}

