import { PresetStoreageWhenNotExist } from '@models/StorageChrome'
import React, { createContext, useEffect, useReducer } from 'react'
import { RgbColor } from 'react-colorful'
import { StorageItems, StoragePreset } from '../models/Storage'


type StorageContextReducerActions =
    {
        type: 'changeFontSize', fontSize: number
    } |
    {
        type: 'changeOverlaySize', size: { width: number, height: number }
    } |
    {
        type: 'changeOverlayPosition', position: { top: number, left: number }
    } |
    {
        type: 'changeOpacity', opacity: number
    } |
    {
        type: 'changeOpacitySC', opacitySC: number
    } |
    {
        type: 'changeBackgroundBlur', blur: number
    } |
    {
        type: 'setStorageToLocalContext', items: StorageItems
    } |
    {
        type: 'toggleOverlay'
    } |
    {
        type: 'changeBackgroundColor', backgroundColor: RgbColor
    } |
    {
        type: 'setDefault'
    } |
    {
        type: 'setSettingsPanelDefault'
    }

export interface IStorageContext {
    storage: StorageItems,
    storageDispatch: React.Dispatch<StorageContextReducerActions>
}


export const StorageContext = createContext<IStorageContext>({ storage: StoragePreset } as IStorageContext)

const storageContextReducer: React.Reducer<StorageItems, StorageContextReducerActions> = (preState, action) => {
    switch (action.type) {
        case 'changeFontSize':
            chrome.storage.local.set({ 'fontSize': action.fontSize })
            return { ...preState, fontSize: action.fontSize }
        case 'changeOpacity':
            chrome.storage.local.set({ 'opacity': action.opacity })
            return { ...preState, opacity: action.opacity }
        case 'changeOpacitySC':
            chrome.storage.local.set({ 'opacitySC': action.opacitySC })
            return { ...preState, opacitySC: action.opacitySC }
        case 'changeOverlayPosition':
            chrome.storage.local.set({ 'top': action.position.top })
            chrome.storage.local.set({ 'left': action.position.left })
            return { ...preState, top: action.position.top, left: action.position.left }
        case 'changeOverlaySize':
            chrome.storage.local.set({ 'width': action.size.width })
            chrome.storage.local.set({ 'height': action.size.height })
            return { ...preState, width: action.size.width, height: action.size.height }
        case 'changeBackgroundBlur':
            chrome.storage.local.set({ 'blur': action.blur })
            return { ...preState, blur: action.blur }
        case 'toggleOverlay':
            chrome.storage.local.set({ 'show': !preState.show })
            return { ...preState, show: !preState.show }
        case 'setStorageToLocalContext':
            return { ...preState, ...action.items }
        case 'changeBackgroundColor':
            chrome.storage.local.set({ 'color': action.backgroundColor })
            return { ...preState, backgroundColor: action.backgroundColor }
        case 'setDefault':
            chrome.storage.local.clear(() => chrome.storage.local.set(StoragePreset))
            return { ...preState, ...StoragePreset }
        case 'setSettingsPanelDefault':
            const resetValue = Object.keys(StoragePreset).reduce((pre, k) => {
                const key = k as keyof StorageItems
                if (key === 'blur' || key === 'backgroundColor' || key === 'opacity' || key === 'opacitySC' || key === 'fontSize')
                    return { ...pre, [key]: StoragePreset[key] }
                else return pre
            }, {})
            chrome.storage.local.set(resetValue)
            return { ...preState, ...resetValue }
        default:
            throw new Error()
    }

}


export const StorageContextProvider: React.FC = ({ children }) => {

    const [storage, storageDispatch] = useReducer(storageContextReducer, StoragePreset)

    useEffect(() => {
        PresetStoreageWhenNotExist().then(items => {
            if (!items) return
            storageDispatch({ type: 'setStorageToLocalContext', items })
        })
    }, [])

    return (
        <StorageContext.Provider value={{ storage, storageDispatch }}>
            {children}
        </StorageContext.Provider>
    )

}

