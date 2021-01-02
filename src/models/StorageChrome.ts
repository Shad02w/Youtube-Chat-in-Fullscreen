/**
 * This file contains all function of storage of chrome api
 */

import chromep from "chrome-promise"
import { StorageItems, StoragePreset } from "./Storage"

/**
 * check all the preset key, is not in current storage, set to preset value
 */
export const PresetStoreageWhenNotExist = async () => {
    try {
        const storage = await chromep.storage.local.get(null) as Partial<StorageItems>
        await Object.keys(StoragePreset).map((k) => {
            const key = k as keyof StorageItems
            if (storage[key] === undefined)
                return chromep.storage.local.set({ [key]: StoragePreset[key] })
            else
                return Promise.resolve()
        })
        return await chromep.storage.local.get(null) as StorageItems
    } catch (error) {
        console.error(error)
        return undefined
    }
}
