import { useInterceptElement } from "@hooks/useInterceptElement"
import { createInterceptElement } from "@models/Intercept"
import { cleanup } from "@testing-library/react"
import '@testing-library/jest-dom';
import { renderHook, act } from "@testing-library/react-hooks";

// mutation observer can not trigger by innerHTML, innerText and textContent
describe('useInterceptElement hook testing', () => {
    const id = 'idForElement'
    const helloMessage = { message: 'hello' }

    afterEach(() => {
        cleanup()
        document.body.innerHTML = ''
    })

    test('Should return initValue when no intercept element is not exist', async () => {
        const { result } = renderHook(() => useInterceptElement(id, helloMessage))
        expect(result.current).toStrictEqual(helloMessage)
    })

    test('Should return content of intercept element instead of initValue when element already exist', async () => {
        const byeMessage = { message: 'bye' }
        const interceptEl = createInterceptElement(id, byeMessage)
        interceptEl.mount()

        const { result } = renderHook(() => useInterceptElement(id, helloMessage))
        expect(result.current).toStrictEqual(byeMessage)
    })

    test('Should return new value instead of initValue when content of intercept element update', async () => {
        const byeMessage = { message: 'bye' }
        const interceptEl = createInterceptElement(id, byeMessage)
        interceptEl.mount()

        const { result } = renderHook(() => useInterceptElement(id, helloMessage))
        await act(async () => {
            interceptEl.set(helloMessage)
        })
        expect(result.current).toStrictEqual(helloMessage)
    })


})