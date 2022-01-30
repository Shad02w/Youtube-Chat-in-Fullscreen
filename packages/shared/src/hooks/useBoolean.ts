import { useCallback, useState } from 'react'

export const useBool = (initial: boolean) => {
    const [value, setVal] = useState(initial)

    const setFalse = useCallback(() => setVal(false), [])
    const setTrue = useCallback(() => setVal(true), [])
    const toggle = useCallback(() => setVal(_ => !_), [])

    return { value, setFalse, setTrue, toggle }
}
