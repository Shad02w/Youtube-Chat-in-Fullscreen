
interface StyleStorageItem {
    top: number,
    left: number,
    opacity: number,
    opacitySC: number,
    width: number,
    height: number,
    fontSize: number,
    blur: number,
    show: boolean
}

interface AppStorageItem {
    on: boolean,
}

export type StorageItems = AppStorageItem & StyleStorageItem


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
    show: true
}

export const MinHeight = 70
export const MinWidth = 250
