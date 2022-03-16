import { StorageUtil } from '../src/util/storage-util'

interface MergeObjectTestSet {
    old: Record<string, any>
    updated: Record<string, any>
    expected: Record<string, any>
}

describe('storage-util test', () => {
    const mergeObjectTestSet: MergeObjectTestSet[] = [
        {
            old: { a: 12, b: 'age', c: 4 },
            updated: { a: 3, b: 'name' },
            expected: { a: 12, b: 'age', c: 4 }
        },
        {
            old: { a: 12, b: 'age', c: 4 },
            updated: { a: 3, b: 'name' },
            expected: { a: 12, b: 'age', c: 4 }
        },
        {
            old: { a: 12, b: 'age', c: { d: 4 }, d: 10 },
            updated: { b: 'name', c: 4 },
            expected: { a: 12, b: 'age', c: { d: 4 }, d: 10 }
        }
    ]

    test.each(mergeObjectTestSet)('Update config recursively', ({ old, updated, expected }: MergeObjectTestSet) => {
        expect(StorageUtil.updateConfig(old, updated)).toStrictEqual(expected)
    })
})
