import { useElementState } from "@hooks/useElementState"
import { createInterceptElement, getInterceptElementContent } from "@models/Intercept"
import { render, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

type ElementState = ReturnType<typeof useElementState>

describe('useElementState hook testing', () => {


    let elementState: ElementState | undefined
    const id = 'idForElement'

    const setup = (): ElementState => {

        const result = {} as ElementState
        const TestComponent = () => {
            Object.assign(result, useElementState(() => {
                const interceptEl = document.getElementById(id)
                return interceptEl ? interceptEl : undefined
            }))
            return null
        }
        render(<TestComponent />)
        return result
    }


    afterEach(async () => {
        await cleanup()
        document.body.textContent = ''
        elementState = undefined

    })

    describe('Intercept element does not exist when creating the hook', () => {
        beforeEach(() => elementState = setup())


        test('Should return true ready state when target element is created', async () => {
            expect(elementState?.ready).toBeFalsy()
            const data = { message: 'hello' }
            const interceptEl = createInterceptElement(id, data)
            interceptEl.mount()
            await waitFor(() => expect(elementState?.ready).toBeTruthy())
        })

        test('Should return false ready state when target element is not exist', () => {
            expect(elementState).toBeDefined()
            expect(elementState!.ready).toBeFalsy()
        })
    })

    describe('Intercept element does exist before creating the hook', () => {
        const presetData = { message: 'bye' }
        beforeEach(() => {
            const interceptEl = createInterceptElement(id, presetData)
            interceptEl.mount()
        })

        test('Should directly return true', async () => {
            expect(getInterceptElementContent(document.getElementById(id)!)).toStrictEqual(presetData)
            const result = setup()
            expect(result.ready).toBeTruthy()
            document.body.textContent = ''
            await waitFor(() => expect(result.ready).toBeTruthy())
        })
    })
})