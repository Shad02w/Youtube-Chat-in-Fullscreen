import { useInterceptElement } from "@hooks/useInterceptElement"
import { createInterceptElement } from "@models/Intercept"
import '@testing-library/jest-dom';
import { renderHook, cleanup, act } from "@testing-library/react-hooks";
import { waitFor } from '@testing-library/react'

// mutation observer can not trigger by innerHTML, innerText and textContent
describe('useInterceptElement hook testing', () => {
    const id = 'idForElement'
    const helloMessage = { message: 'hello' }


    afterEach(async (done) => {
        await cleanup()
        document.body.textContent = ''
        done()

    })

    test('Should return initValue when no intercept element is not exist', async () => {
        const { result } = renderHook(() => useInterceptElement(id, helloMessage))
        expect(result.current.data).toStrictEqual(helloMessage)
    })

    test('Should return content of intercept element instead of initValue when element already exist, and then remove element return a false ready state', async () => {
        const byeMessage = { message: 'bye' }
        const interceptEl = createInterceptElement(id, byeMessage)
        interceptEl.mount()

        const { result } = renderHook(() => useInterceptElement(id, helloMessage))
        expect(result.current.data).toStrictEqual(byeMessage)
        expect(result.current.ready).toBeTruthy()

        await act(async () => {
            document.body.textContent = ''
        })

        expect(result.current.ready).toBeFalsy()
        expect(result.current.data).toStrictEqual(byeMessage)
    })

    test('Should return updated value instead of initValue when content of intercept element update', async () => {
        const byeMessage = { message: 'bye' }
        const interceptEl = createInterceptElement(id, byeMessage)
        interceptEl.mount()

        const { result } = renderHook(() => useInterceptElement(id, helloMessage))

        waitFor(() => {
            expect(result.current.ready).toBeTruthy()
            expect(result.current.data).toStrictEqual(byeMessage)
        })


        await act(async () => {
            interceptEl.set(helloMessage)
        })

        waitFor(() => expect(result.current.data).toStrictEqual(helloMessage))
    })


})