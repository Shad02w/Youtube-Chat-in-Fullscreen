import { RefObject, useEffect } from 'react'
import { debouncePromise } from '../models/Function'
import { useOnEventEnd } from './useOnEventEnd'


export const useResizable = (ref: RefObject<HTMLElement>) => {
    const { OnEventEnd: OnResizeEnd, setEventEnd: setOnResizeEnd } = useOnEventEnd()
    useEffect(() => {
        if (!ref.current) return

        // const Resize = ResizeDebounce(250)
        // const Resize = debounce(250, () => setOnResizeEnd())
        const Resize = debouncePromise(250)

        const containerObserver = new MutationObserver(async (mutaions) => {
            const attributesMutation = mutaions.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'style')
            if (!attributesMutation) return
            await Resize()
            setOnResizeEnd()
        })
        containerObserver.observe(ref.current, { childList: true, attributes: true })
        return () => containerObserver.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])

    return { OnResizeEnd }
}