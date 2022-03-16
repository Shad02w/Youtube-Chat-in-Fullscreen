/**
 * This function update config according to following principles
 * 1. Keep value when key is the same
 * 2. Add new value when key is absent
 */
function updateConfig(oldValue: Record<string, any>, newValue: Record<string, any>): Record<string, any> {
    const target = { ...oldValue }

    for (const [key] of Object.entries(newValue)) {
        if (target[key] === undefined) {
            target[key] === newValue[key]
        } else if (typeof target[key] === 'object') {
            target[key] = updateConfig(target[key], newValue[key])
        }
    }
    return target
}

export const StorageUtil = Object.freeze({
    updateConfig
})
