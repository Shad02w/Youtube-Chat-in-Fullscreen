export interface Preference {
    enable: boolean
    position: [number, number]
    width: number
    height: number
    opacity: number
    blur: number
    fontSize: number
}

export const initialPreference: Preference = {
    enable: true,
    position: [20, 20],
    width: 300,
    height: 400,
    opacity: 1,
    blur: 0,
    fontSize: 1
}
