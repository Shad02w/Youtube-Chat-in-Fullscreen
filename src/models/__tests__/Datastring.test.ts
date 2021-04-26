import { Datastring2JSON, JSON2Datastring } from '@models/Datastring'
import { Base64 } from 'js-base64'
import jsonSample from '../../sample/LiveResponseSample.json'

describe('Datastring function testing', () => {
    const datastring = Base64.encode(JSON.stringify(jsonSample))

    test('Should covert a json object to a based64 encoded string', () => {
        expect(JSON2Datastring(jsonSample)).toEqual(datastring)
    })

    test('Should covert a base64 encoded string to a json object', () => {
        expect(Datastring2JSON(datastring)).toStrictEqual(jsonSample)
    })
})
