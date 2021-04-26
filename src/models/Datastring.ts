import { Base64 } from 'js-base64'
export type Datastring = string

export const JSON2Datastring = <T>(obj: T): string => Base64.encode(JSON.stringify(obj))
export const Datastring2JSON = <T>(datastring: Datastring): T => JSON.parse(Base64.decode(datastring))
