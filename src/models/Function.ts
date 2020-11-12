
import { LiveChatResponse } from './Fetch';


export function debounce(wait: number, callback: Function) {
    let timeoutId = 0
    return <T extends any[]>(...args: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback.call(undefined, ...args), wait)
    }
}

export const debouncePromise = (wait: number) => {
    let timer: number;
    return <T extends any[]>(...args: T) => {
        clearTimeout(timer)
        return new Promise<typeof args>(resovle => {
            timer = setTimeout(() => resovle(args), wait)
        })
    }
}

export function FindObjectByKeyRecursively(obj: LiveChatResponse, targetKey: string): any | undefined {
    const result = Object.keys(obj).find(k => k === targetKey)
    if (result)
        return obj[result]
    else if (typeof obj === 'object')
        for (const k of Object.keys(obj)) {
            const r = FindObjectByKeyRecursively(obj[k], targetKey)
            if (r !== undefined) return r
        }
    return undefined
}