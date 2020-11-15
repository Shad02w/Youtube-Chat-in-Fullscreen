import { createInterceptElement } from "@models/Intercept"
import { getByTestId } from '@testing-library/dom'
import base64 from 'base-64';
import "@testing-library/jest-dom"


describe('Intercept element test', () => {

    const elId = 'idForIE'
    const initValue = { message: 'hello' }
    const interceptEl = createInterceptElement(elId, initValue)

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
        const data = { message: 'set' }
        interceptEl.set(data)
        expect(getByTestId(document.body, `intercept-${elId}`)).toHaveTextContent(base64.encode(JSON.stringify(data)))
    })

    test('Get content of intercept element', () => {
        const data = { message: 'get' }
        interceptEl.set(data)
        expect(interceptEl.get()).toStrictEqual(data)
    })

})