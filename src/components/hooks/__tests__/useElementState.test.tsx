import { useElementStatus } from "@hooks/useElementState"
import { createInterceptElement } from "@models/Intercept"
import { render, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

type ElementState = ReturnType<typeof useElementStatus>

describe('useElementState hook testing', () => {


    let elementState: ElementState | undefined
    const id = 'idForElement'

    const setup = (): ElementState => {

        const result = {} as ElementState
        const TestComponent = () => {
            Object.assign(result, useElementStatus(id))
            return null
        }
        render(<TestComponent />)
        return result
    }

    beforeEach(() => elementState = setup())

    afterEach(() => {
        cleanup()
        document.body.innerHTML = ''
        elementState = undefined

    })

    test('Should return true ready state when target element is created', async () => {
        expect(elementState?.ready).toBeFalsy()
        const data = { message: 'hello' }
        const interceptEl = createInterceptElement(id, data)
        interceptEl.mount()
        await waitFor(() => expect(elementState?.ready).toBeTruthy())
    })

    test('Should return false ready state when target element is not exist', () => {
        expect(elementState).not.toBeUndefined()
        expect(elementState!.ready).toBeFalsy()
    })


})