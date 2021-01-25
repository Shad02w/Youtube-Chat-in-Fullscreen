import { LiveChatResponse } from '@models/Fetch';
import { StorageItems, StoragePreset } from './Storage';


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

export const FillWithPresetValueWhenNotExist = <T extends object, U extends keyof T>(oldValue: T, newValue: T): T => {
    const keys = Object.keys(newValue) as U[]
    const target = Object.assign({}, oldValue) as T
    for (const key of keys) {
        if (target[key] === undefined) target[key] = newValue[key]
        else if (typeof target[key] === 'object') {
            target[key] = FillWithPresetValueWhenNotExist(target[key], newValue[key] as {},) as T[U]
        }
    }
    return target

}