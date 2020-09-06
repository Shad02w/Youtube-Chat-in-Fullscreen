import axios from 'axios'

export type ScrollDirection = 'UP' | 'DOWN'

interface Response { [key: string]: any }



/* Replay the get_live_chat* xhr request to get the response */
export async function ReplayRequest(url: string, requestBody?: JSON): Promise<Response | undefined> {
    // The request either be get or post
    // The type of return response can change overtime
    let data: Response | undefined
    try {
        if (!requestBody) {
            const res = await axios.get(url)
            data = res.data as Response
            // console.log('GET', data)
        } else {
            const res = await axios.post(url, requestBody, { responseType: 'json' })
            data = res.data as Response
            console.log('POST', data)
        }
    } catch (error) {
        if (error.response)
            console.error(error.response.data)
        else
            console.error(error)
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
            const result = FindObjectByKeyRecursively(obj[k], targetKey)
            if (result !== undefined) return result
        }
    return undefined
}
