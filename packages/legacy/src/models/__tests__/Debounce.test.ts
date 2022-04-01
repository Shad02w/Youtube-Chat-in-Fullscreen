import { debounce } from '@models/Function'

beforeEach(() => {
    jest.useFakeTimers()
})

afterEach(() => {
    jest.clearAllTimers()
})

const wait = 500,
    arg1 = 3,
    arg2 = 3
describe('Debounce function test', () => {
    test('Should only be run once even though the function is called multiple time within 500ms', () => {
        const mockFn = jest.fn()
        const run = debounce(wait, mockFn)
        run(arg1, arg2)
        run(arg1, arg2)
        run(arg1, arg2)
        jest.advanceTimersByTime(wait)

        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toBeCalledWith(arg1, arg2)

        jest.clearAllTimers()
    })
})
