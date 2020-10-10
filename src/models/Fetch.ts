import axios from 'axios'

interface Response { [key: string]: any }

const forbiddenRequestHeaders = [
    // from w3c spec :https://fetch.spec.whatwg.org/#forbidden-header-name
    `Accept-Charset`,
    `Accept-Encoding`,
    `Access-Control-Request-Headers`,
    `Access-Control-Request-Method`,
    `Connection`,
    `Content-Length`,
    `Cookie`,
    `Cookie2`,
    `Date`,
    `DNT`,
    `Expect`,
    `Host`,
    `Keep-Alive`,
    `Origin`,
    `Referer`,
    `TE`,
    `Trailer`,
    `Transfer-Encoding`,
    `Upgrade`,
    `Via`,
    `^Proxy-`,
    `^Sec-`,
    `User-Agent`,

    // Added
]


export const createHeadersObject = (requestHeaders: chrome.webRequest.HttpHeader[] | undefined) => {
    if (!requestHeaders) return undefined
    const regex = new RegExp(forbiddenRequestHeaders.join('|'), 'i')
    const headers = requestHeaders.reduce((pre, curr) => {
        if (curr.name.match(regex)) return pre
        else return Object.assign(pre, { [curr.name]: curr.value })
    }, {} as { [key: string]: string })
    return headers
}


/* Replay the get_live_chat* xhr request to get the response */
export async function FetchData(url: string, requestBody?: JSON, requestHeaders?: chrome.webRequest.HttpHeader[]): Promise<Response | undefined> {
    // The request either be get or post
    // The type of return response can change overtime
    let data: Response
    try {
        if (!requestBody) {
            const res = await axios.get(url)
            data = res.data as Response
        } else {
            const headers = createHeadersObject(requestHeaders)
            const res = await axios.post(url,
                requestBody,
                {
                    responseType: 'json',
                    headers: (headers) ? headers : {}
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