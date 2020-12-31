import { useMutation } from '@hooks/useMutation'
import { waitFor } from '@testing-library/react'
import { renderHook, act, cleanup } from '@testing-library/react-hooks'

describe('Testing for useElement hook', () => {
    const elId = 'this-is-the-id'

    const getElementCallback = () => {
        const el = document.getElementById(elId)
        return (el) ? el : undefined
    }

    const createElement = () => {
        const div = document.createElement('div')
        div.id = elId
        return div
    }

    afterEach(async () => {
        await cleanup()
        document.body.textContent = ''
    })

    test('Should return expected value when element is not exist', () => {
        const { result } = renderHook(() => useMutation(getElementCallback))
        expect(result.current.exist).toBeFalsy()
        expect(result.current.node).toBeUndefined()
    })

    test('Should return expected value when element is already exist', () => {
        document.body.append(createElement())
        const { result } = renderHook(() => useMutation(getElementCallback))
        expect(result.current.exist).toBeTruthy()
        expect(result.current.node?.id).toEqual(elId)
    })

    test('Should change return value when element is deleted and created', async () => {
        const { result } = renderHook(() => useMutation(getElementCallback))
        expect(result.current.exist).toBeFalsy()
        expect(result.current.node).toBeUndefined()

        await act(async () => {
            document.body.append(createElement())
        })

        await waitFor(() => {
            expect(result.current.exist).toBeTruthy()
            expect(result.current.node?.id).toEqual(elId)
        })

        await act(async () => {
            document.body.textContent = ''
        })

        await waitFor(() => {
            expect(result.current.exist).toBeFalsy()
            expect(result.current.node).toBeUndefined()
        })

        await act(async () => {
            document.body.append(createElement())
        })

        return waitFor(() => {
            expect(result.current.exist).toBeTruthy()
            expect(result.current.node?.id).toEqual(elId)
        })

    })

})