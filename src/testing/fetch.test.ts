import { createHeadersObject } from '../models/Fetch'



test('Properly create a headers object', () => {
    const requestHeaders: chrome.webRequest.HttpHeader[] = [
        { name: 'Sec-Fetch-Dest', value: 'same-origin' },
        { name: 'Sec-Fetch-Site', value: 'empty' },
        { name: 'Authorization', value: 'SAPISIDHASH 1602314416_06337abcb07814918094705ebee634194a31d558' },
        { name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…L, like Gecko) Chrome/85.0.4183.121 Safari/537.36' },
        { name: 'X-Goog-AuthUser', value: '1' },
        { name: 'X-Client-Data', value: 'CIi2yQEIpLbJAQjBtskBCKmdygEImbXKAQisx8oBCPbHygEI58jKAQjpyMoBCLTLygEI3s7KAQif2MoBCPKXywEY57/KARjzwMoB' }
    ]
    expect(createHeadersObject(requestHeaders)).toStrictEqual({
        'X-Client-Data': 'CIi2yQEIpLbJAQjBtskBCKmdygEImbXKAQisx8oBCPbHygEI58jKAQjpyMoBCLTLygEI3s7KAQif2MoBCPKXywEY57/KARjzwMoB',
        'Authorization': 'SAPISIDHASH 1602314416_06337abcb07814918094705ebee634194a31d558',
        'X-Goog-AuthUser': '1'
    })
})






