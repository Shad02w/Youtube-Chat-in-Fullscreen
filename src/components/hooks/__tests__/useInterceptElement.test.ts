import { useInterceptElement } from "@hooks/useInterceptElement"
import { createInterceptElement } from "@models/Intercept"
import { cleanup, renderHook } from "@testing-library/react-hooks"

describe('useInterceptElement hook testing', () => {
    const id = 'idForElement'
    const initValue = { message: 'hello' }

    afterEach(() => {
        cleanup()
        document.body.innerHTML = ''
    })

    test('Should return initValue when no intercept element is not exist', () => {
        const { result } = renderHook(() => useInterceptElement(id, initValue))
        expect(result.current).toStrictEqual(initValue)
    })

    test('Should return content of intercept element instead of initValue when element already exist', () => {
        const initValueOfInterceptEl = { message: 'bye' }
        const interceptEl = createInterceptElement(id, initValueOfInterceptEl)
        interceptEl.mount()
        const { result } = renderHook(() => useInterceptElement(id, initValue))
        expect(result.current).toStrictEqual(initValueOfInterceptEl)

    })

})