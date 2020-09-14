import { useState } from 'react'

export const useOnEventEnd = () => {
    const [OnEventEnd, set] = useState<number>(0)
    const setEventEnd = () => set(pre => pre + 1)
    return { OnEventEnd, setEventEnd }
}
