import { useState } from 'react'

type EventEnded = number

export const useOnEventEnd = () => {
    const [OnEventEnd, set] = useState<EventEnded>(0)
    const setEventEnd = () => set(pre => pre + 1)
    return { OnEventEnd, setEventEnd }
}

