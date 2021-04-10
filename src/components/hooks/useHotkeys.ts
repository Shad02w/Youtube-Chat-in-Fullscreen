import { useEffect } from 'react'
export const useCtrlAltHotKey = (key: string, pressed: () => any) => {
    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === key) pressed()
        }
        document.addEventListener('keydown', keydownListener)
        return () => document.removeEventListener('keydown', keydownListener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
