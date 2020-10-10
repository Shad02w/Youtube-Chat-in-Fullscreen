

export function debounce(wait: number, callback: Function) {
    let timeoutId = 0
    return <T extends any[]>(...args: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback.call(undefined, ...args), wait)
    }
}

export const debouncePromise = (time: number) => {
    let timer: number;
    return <T extends any[]>(...args: T) => {
        clearTimeout(timer)
        return new Promise<typeof args>(resovle => {
            timer = setTimeout(() => resovle(args), time)
        })
    }
}

export const handleError = <T extends any[]>(fn: (...args: T) => Promise<any>) => {
    return (...args: T) => {
        return fn(...args).catch(err => console.error(err))
    }
}
