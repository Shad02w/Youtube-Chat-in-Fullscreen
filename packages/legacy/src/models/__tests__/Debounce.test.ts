import { debounce, debouncePromise } from '@models/Function'

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

        expect(setTimeout).toHaveBeenCalledTimes(3)
        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toBeCalledWith(arg1, arg2)

        jest.clearAllTimers()
    })
})

describe('Debounce Promise function test', () => {
    test('Should only be run once even though the function is called multiple time within 500ms', done => {
        const run = debouncePromise(wait)
        const mockFn = jest.fn()
        const runWapper = async () => {
            await run()
            mockFn()
            expect(setTimeout).toHaveBeenCalledTimes(3)
            expect(mockFn).toHaveBeenCalledTimes(1)
            done()
        }
        runWapper()
        runWapper()
        runWapper()
        jest.advanceTimersByTime(wait)
    })
})
