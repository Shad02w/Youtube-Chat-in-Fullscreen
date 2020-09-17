import { useState } from 'react'

export const useQueue = <T>(init: T[]) => {
    const [queue, setQueue] = useState<T[]>(init)

    const dequeue = (): T => {
        const [poped, ...rest] = queue
        setQueue(rest)
        return poped
    }

    const enqueue = (item: T) => setQueue(pre => [...pre, item])

    return { queue, enqueue, dequeue }

}
