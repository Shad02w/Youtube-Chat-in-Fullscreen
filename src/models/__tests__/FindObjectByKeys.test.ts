import { FindObjectByKeyRecursively } from '@models/Function'

describe('FindObjectByKeyRecursively test', () => {

    const obj = {
        name: 'youtube-chat-in-fullscreen',
        actions: [
            { lable: 1 },
            { lable: 2 },
            { lable: 3 }
        ],
        layer1: {
            layer2: 'this is it'
        }
    }

    test('Return object when the key is match', () => {
        expect(FindObjectByKeyRecursively(obj, 'actions')).toStrictEqual(obj.actions)
    })

    test('Return undefined when object is not found ', () => {
        expect(FindObjectByKeyRecursively(obj, 'label')).toBeUndefined()
    })

    test('Find the object recursively', () => {
        expect(FindObjectByKeyRecursively(obj, 'layer2')).toStrictEqual(obj.layer1.layer2)
    })
})
