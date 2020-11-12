import { createInterceptElement } from "@models/Intercept"
import { getByTestId } from '@testing-library/dom'
import "@testing-library/jest-dom"


describe('Intercept element test', () => {

    const elId = 'idForIE'
    const interceptEl = createInterceptElement<{ hi: number }>(elId)

    beforeEach(() => {
        interceptEl.mount()
    })

    afterEach(() => {
        const el = document.getElementById(elId)
        if (el) el.remove()
    })


    test('Properly mount intercept element', () => {
        expect(getByTestId(document.body, `intercept-${elId}`).id).toBe(elId)
    })

    test('Set content of intercept element', () => {
        const data = { hi: 1 }
        interceptEl.set(data)
        expect(getByTestId(document.body, `intercept-${elId}`)).toHaveTextContent(JSON.stringify(data))
    })

    test('Get content of intercept element', () => {
        const data = { hi: 1 }
        interceptEl.set(data)
        expect(interceptEl.get()).toStrictEqual(data)
    })
})