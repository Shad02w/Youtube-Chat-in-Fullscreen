
interface StyleStorageItem {
    top: number,
    left: number,
    opacity: number,
    width: number,
    height: number,
    fontSize: number,
    blur: number,
    show:boolean
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
    // use spacing to define font size
    fontSize: 2,
    opacity: 0.8,
    blur: 10,
    show:true
}