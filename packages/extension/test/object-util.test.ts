import { ObjectUtil } from '../src/util/object-util'

interface FindObjectTestSet {
    target: Record<string, unknown>
    key: string
    expected: any
}

describe('object-util test', () => {
    const findObjectTestSet: FindObjectTestSet[] = [
        {
            target: { a: 3, b: 'name', c: 4 },
            key: 'c',
            expected: 4
        },
        {
            target: { a: 3, b: 'name', c: { config: [1, 2] } },
            key: 'config',
            expected: [1, 2]
        },
        {
            target: { a: 3, b: 'name', c: { config: { name: 'Peter', age: 12 } } },
            key: 'age',
            expected: 12
        },
        {
            target: {
                a: { config: { name: 3 } },
                b: 'name',
                c: { config: 3 }
            },
            key: 'config',
            expected: { name: 3 }
        },
        {
            target: { a: { d: { e: { f: { g: 4 } } } }, b: 'name', c: { config: [1, 2] } },
            key: 'g',
            expected: 4
        },
        {
            target: { a: { d: { e: { f: { g: 4 } } } }, b: 'name', c: { config: [1, 2] } },
            key: 'z',
            expected: undefined
        }
    ]
    test.each(findObjectTestSet)('Find object ${target} by key ${key} recursively', ({ target, key, expected }: FindObjectTestSet) => {
        expect(ObjectUtil.findObjectByKeyRecursively(target, key)).toStrictEqual(expected)
    })
})
