import base64 from 'base-64';
export type Datastring = string

export const JSON2Datastring = <T>(obj: T): string => base64.encode(JSON.stringify(obj))
export const Datastring2JSON = <T>(datastring: Datastring): T => JSON.parse(base64.decode(datastring))