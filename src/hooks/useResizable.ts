import { RefObject, useEffect } from 'react'
import { debouncePromise } from '../models/Function'


export const useResizable = (ref: RefObject<HTMLElement>, ended: () => any) => {
    useEffect(() => {
        if (!ref.current) return

        const Resize = debouncePromise(250)

        const containerObserver = new MutationObserver(async (mutaions) => {
            const attributesMutation = mutaions.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'style')
            if (!attributesMutation) return
            await Resize()
            ended()
        })
        containerObserver.observe(ref.current, { childList: true, attributes: true })
        return () => containerObserver.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])
}