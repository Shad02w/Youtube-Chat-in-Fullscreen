import { Datastring2JSON, JSON2Datastring } from '@models/DataString'
import base64 from 'base-64';

describe('Datastring function testing', () => {

    const obj = { message: 'hello', product: ['apple', 'car', 'plane'] }
    const datastring = base64.encode(JSON.stringify(obj))

    test('Should covert a json object to a based64 encoded string', () => {
        expect(JSON2Datastring(obj)).toEqual(datastring)
    })

    test('Should covert a base64 encoded string to a json object', () => {
        expect(Datastring2JSON(datastring)).toStrictEqual(obj)
    })

})