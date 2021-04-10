import { RgbColor } from 'react-colorful'
import { ChatFilter, ChatFilter_Default } from '@models/ChatFilter'
import { Position, Size } from './Interact'

interface StyleStorageItem {
    // top: number,
    // left: number,
    // width: number,
    // height: number,
    opacity: number
    opacitySC: number
    fontSize: number
    blur: number
    show: boolean
    backgroundColor: Color
    color: Color
    chatFilter: ChatFilter
    separateLine: boolean
    native: boolean
    size: Size
    position: Partial<Position>
}

interface AppStorageItem {
    on: boolean
}

export type StorageItems = AppStorageItem & StyleStorageItem
export type Color = RgbColor

export type storageChanges<T> = { [K in keyof T]: chrome.storage.StorageChange }

export const StoragePreset: StorageItems = {
    on: true,
    fontSize: 16,
    opacity: 0.5,
    opacitySC: 1,
    blur: 0,
    show: true,
    backgroundColor: { r: 20, g: 20, b: 20 },
    color: { r: 255, g: 255, b: 255 },
    chatFilter: ChatFilter_Default,
    separateLine: false,
    native: false,
    size: {
        width: 400,
        height: 500,
    },
    position: {
        top: 50,
        left: 50,
    },
}

export const MinHeight = 70
export const MinWidth = 250
