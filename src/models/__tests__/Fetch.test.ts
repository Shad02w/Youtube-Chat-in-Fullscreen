import { createHeadersObject, FetchData } from '@models/Fetch'
import axios from 'axios'




describe('Fetch relate function testing', () => {
    const mockHeaders: chrome.webRequest.HttpHeader[] = [
        { name: 'Sec-Fetch-Dest', value: 'same-origin' },
        { name: 'Sec-Fetch-Site', value: 'empty' },
        { name: 'Authorization', value: 'SAPISIDHASH 1602314416_06337abcb07814918094705ebee634194a31d558' },
        { name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…L, like Gecko) Chrome/85.0.4183.121 Safari/537.36' },
        { name: 'X-Goog-AuthUser', value: '1' },
        { name: 'X-Client-Data', value: 'CIi2yQEIpLbJAQjBtskBCKmdygEImbXKAQisx8oBCPbHygEI58jKAQjpyMoBCLTLygEI3s7KAQif2MoBCPKXywEY57/KARjzwMoB' }
    ]


    test('Filter forbidden header from HttpHeader array', () => {
        expect(createHeadersObject(mockHeaders)).toStrictEqual({
            'X-Client-Data': 'CIi2yQEIpLbJAQjBtskBCKmdygEImbXKAQisx8oBCPbHygEI58jKAQjpyMoBCLTLygEI3s7KAQif2MoBCPKXywEY57/KARjzwMoB',
            'Authorization': 'SAPISIDHASH 1602314416_06337abcb07814918094705ebee634194a31d558',
            'X-Goog-AuthUser': '1'
        })
    })

    describe('FetchData testing', () => {

        beforeEach(() => {
            jest.restoreAllMocks()
        })

        const res = { data: { hi: 1 } }
        test('Return undefined when request failed', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })
            const data = await FetchData('url')
            expect(data).toBeUndefined()
            consoleSpy.mockRestore()
        })

        test('Get Request', async () => {
            jest.spyOn(axios, 'get').mockResolvedValueOnce(res)
            const data = await FetchData('url')
            expect(data).toStrictEqual(res.data)
        })

        test('Post Request', async () => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(res)
            const requestBody = {} as JSON
            const data = await FetchData('url', requestBody)
            expect(data).toStrictEqual(res.data)
        })

        describe('Shold log response details of error from axios', () => {
            const error = { response: { data: 3 } }


            test('GET method', async () => {
                const cerSpy = jest.spyOn(console, 'error').mockImplementation(e => e)
                jest.spyOn(axios, 'get').mockRejectedValueOnce(error)
                const data = await FetchData('url')
                expect(data).toBeUndefined()
                expect(cerSpy.mock.results[0].value).toStrictEqual(error.response.data)
            })

            test('POST method', async () => {
                const cerSpy = jest.spyOn(console, 'error').mockImplementation(e => e)
                jest.spyOn(axios, 'post').mockRejectedValueOnce(error)
                const data = await FetchData('url', {} as JSON, mockHeaders)
                expect(data).toBeUndefined()
                expect(cerSpy.mock.results[0].value).toStrictEqual(error.response.data)
            })
        })

    })

})