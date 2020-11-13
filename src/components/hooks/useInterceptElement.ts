import { useEffect, useState } from "react"
import { useElementStatus } from "./useElementState"

// export const useInterceptElement = <T>(effect: (data: T) => any, id: string) => {
//     const { ready } = useElementState(id)

//     useEffect(() => {
//         if (ready) {
//             const interceptedElment = document.getElementById(id) as HTMLDivElement
//             const observer = new MutationObserver((mutations) => {
//                 const childMutation = mutations.find(mutation => mutation.type === 'childList')
//                 if (!childMutation) return
//                 const data = JSON.parse((childMutation.target as HTMLDivElement).innerHTML) as T
//                 effect(data)
//             })
//             observer.observe(interceptedElment, { childList: true })
//             return () => observer.disconnect()
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [ready, effect])
// }

export const useInterceptElement = <T>(id: string, initValue: T) => {
    const { ready } = useElementStatus(id)
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

    return { ...data }
}

