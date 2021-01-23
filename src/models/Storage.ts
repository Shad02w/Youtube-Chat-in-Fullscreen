import { RgbColor } from 'react-colorful'
import { ChatFilter } from '@models/ChatFilter'


interface StyleStorageItem {
    top: number,
    left: number,
    opacity: number,
    opacitySC: number,
    width: number,
    height: number,
    fontSize: number,
    blur: number,
    show: boolean,
    backgroundColor: Color
    color: Color
    chatFilter: ChatFilter
    separateLine: boolean,
    native: boolean
}

interface AppStorageItem {
    on: boolean,
}

export type StorageItems = AppStorageItem & StyleStorageItem
export type Color = RgbColor


export type storageChanges<T> = { [K in keyof T]: chrome.storage.StorageChange }

export const StoragePreset: StorageItems = {
    on: true,
    top: 50,
    left: 50,
    width: 400,
    height: 400,
    fontSize: 16,
    opacity: 0.5,
    opacitySC: 1,
    blur: 0,
    show: true,
    backgroundColor: { r: 20, g: 20, b: 20 },
    color: { r: 255, g: 255, b: 255 },
    chatFilter: {
        guest: true,
        member: true,
        superchat: true,
        owner: true,
        membership: true,
        moderator: true,
        sticker: true
    },
    separateLine: false,
    native: false
}

export const MinHeight = 70
export const MinWidth = 250
