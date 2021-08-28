import { FillWithPresetValueWhenNotExist } from '@models/Function'

describe('Funtions testing', () => {
    test('Object should key the old value, and set new value if the key is missing', () => {
        const oldValue = {
            a: 1,
            b: 3,
            d: {
                f: 3,
                person: {
                    name: 'ccy',
                },
            },
        }

        const newValue = {
            a: 2,
            b: 4,
            d: {
                f: 1,
                e: 4,
                person: {
                    name: 'fyy',
                    age: 20,
                },
            },
        }

        const expected = {
            a: 1,
            b: 3,
            d: {
                f: 3,
                e: 4,
                person: {
                    name: 'ccy',
                    age: 20,
                },
            },
        }

        expect(FillWithPresetValueWhenNotExist(oldValue, newValue)).toStrictEqual(expected)
    })
})
