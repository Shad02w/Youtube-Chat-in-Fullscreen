function findObjectByKeyRecursively(obj: object, targetKey: string): any | undefined {
    const key = targetKey as keyof typeof obj
    if (obj[key] !== undefined) return obj[key]
    else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
            const r = findObjectByKeyRecursively(obj[k as keyof typeof obj], targetKey)
            if (r !== undefined) return r
        }
    }
    return undefined
}

export const ObjectUtil = Object.freeze({
    findObjectByKeyRecursively
})
