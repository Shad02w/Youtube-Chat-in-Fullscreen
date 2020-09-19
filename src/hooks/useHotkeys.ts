import { useEffect, useState } from 'react'
import { useOnEventEnd } from './useOnEventEnd'
export const useCtrlAltHotKey = (key: string) => {
    const { OnEventEnd, setEventEnd } = useOnEventEnd()

    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === key)
                setEventEnd()
        }
        document.addEventListener('keydown', keydownListener)
        return () => document.removeEventListener('keydown', keydownListener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return { pressed: OnEventEnd }
}
