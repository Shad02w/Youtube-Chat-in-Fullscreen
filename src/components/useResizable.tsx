import { RefObject, useEffect } from 'react'

type onResizeCallback = (width: number, height: number) => any
const ResizeDebounce = (wait: number) => {
    let timeoutId: number;
    return (width: number, heigth: number, userCallback: onResizeCallback) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => userCallback(width, heigth), wait)
    }
}

export const useResizable = (ref: RefObject<HTMLElement>, onResizeEnd: onResizeCallback) => {
    useEffect(() => {
        if (!ref.current) return

        const Resize = ResizeDebounce(250)

        const containerObserver = new MutationObserver((mutaions) => {
            const attributesMutation = mutaions.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'style')
            if (!attributesMutation) return
            // console.log('attributesMutations', attributesMutation, 'style.width', (attributesMutation.target as HTMLDivElement).style)
            const target = attributesMutation.target as HTMLDivElement
            const width = parseInt(target.style.width),
                height = parseInt(target.style.height)
            Resize(width, height, onResizeEnd)
        })
        containerObserver.observe(ref.current, { childList: true, attributes: true })
        return () => containerObserver.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])
}