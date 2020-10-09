import axios from 'axios'

export type ScrollDirection = 'UP' | 'DOWN'

interface Response { [key: string]: any }

const getHeader = (name: string, requestHeaders: chrome.webRequest.HttpHeader[] | undefined): string | undefined => {
    if (!requestHeaders) return undefined
    const header = requestHeaders.find(h => h.name === name)
    if (!header) return undefined
    return header.value
}



/* Replay the get_live_chat* xhr request to get the response */
export async function FetchData(url: string, requestBody?: JSON, requestHeaders?: chrome.webRequest.HttpHeader[]): Promise<Response | undefined> {
    // The request either be get or post
    // The type of return response can change overtime
    let data: Response
    const token = getHeader('Authorization', requestHeaders)
    try {
        if (!requestBody) {
            const res = await axios.get(url)
            data = res.data as Response
        } else {
            const res = await axios.post(url,
                requestBody,
                {
                    responseType: 'json',
                    headers: (token) ? { 'Authorization': token } : {}
                })
            data = res.data as Response
        }
    } catch (error) {
        if (error.response)
            console.error(error.response.data)
        else
            console.error(error)
        return undefined
    }
    return data
}

export function createScrollDirectionDetector() {
    let lastScrollTop = 0;
    return function (currentScrollTop: number, currentScrollHeight: number, clientHeight: number): ScrollDirection {
        const temp = lastScrollTop
        lastScrollTop = currentScrollTop
        if (currentScrollTop < temp && Math.abs(currentScrollHeight - (currentScrollTop + clientHeight)) >= 2) return 'UP'
        else return 'DOWN'

        // if currentScrollTop < lastScroll top, it have 2 possibles
        // 1. user scroll up 
        // 2. scrollHeight of the container decrease, so the current must smaller than last scroll top, but it is not a scroll up

    }
}


export function FindObjectByKeyRecursively(obj: Response, targetKey: string): any | undefined {
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
