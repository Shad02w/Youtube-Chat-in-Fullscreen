import React, { createContext, useEffect, useReducer } from 'react'
import { RgbColor } from 'react-colorful'
import { StorageItems, StoragePreset } from '@models/Storage'
import { ChatFilter } from '@models/ChatFilter'
import chromep from 'chrome-promise'
import { FillWithPresetValueWhenNotExist } from '@models/Function'
import { Size, Position } from '@models/Interact'


type StorageContextReducerActions =
    {
        type: 'changeFontSize', fontSize: number
    } |
    {
        type: 'changeOverlaySize', size: Size
    } |
    {
        type: 'changeOverlayPosition', position: Partial<Position>
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
        type: 'changeFontColor', color: RgbColor
    } |
    {
        type: 'changeChatFilter', filter: ChatFilter
    } |
    {
        type: 'changeSeparateLine', separateLine: boolean
    } |
    {
        type: 'changeNativeMode', native: boolean
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
            chrome.storage.local.set({ 'position': action.position })
            return { ...preState, position: action.position }
        case 'changeOverlaySize':
            chrome.storage.local.set({ 'size': action.size })
            return { ...preState, size: { width: action.size.width, height: action.size.height } }
        case 'changeBackgroundBlur':
            chrome.storage.local.set({ 'blur': action.blur })
            return { ...preState, blur: action.blur }
        case 'toggleOverlay':
            chrome.storage.local.set({ 'show': !preState.show })
            return { ...preState, show: !preState.show }
        case 'setStorageToLocalContext':
            return { ...action.items }
        case 'changeBackgroundColor':
            chrome.storage.local.set({ 'backgroundColor': action.backgroundColor })
            return { ...preState, backgroundColor: action.backgroundColor }
        case 'changeFontColor':
            chrome.storage.local.set({ 'color': action.color })
            return { ...preState, color: action.color }
        case 'changeChatFilter':
            chrome.storage.local.set({ 'chatFilter': { ...action.filter } })
            return { ...preState, chatFilter: { ...action.filter } }
        case 'changeSeparateLine':
            chrome.storage.local.set({ 'separateLine': action.separateLine })
            return { ...preState, separateLine: action.separateLine }
        case 'changeNativeMode':
            chrome.storage.local.set({ 'native': action.native })
            return { ...preState, native: action.native }
        case 'setDefault':
            chrome.storage.local.clear(() => chrome.storage.local.set(StoragePreset))
            return { ...preState, ...StoragePreset }
        case 'setSettingsPanelDefault':
            const resetValue = Object.keys(StoragePreset).reduce((pre, k) => {
                const key = k as keyof StorageItems
                if (key === 'blur' || key === 'backgroundColor' || key === 'color' || key === 'opacity' || key === 'opacitySC' || key === 'fontSize')
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
        chromep.storage.local.get(null)
            .then(current => FillWithPresetValueWhenNotExist(current, StoragePreset) as StorageItems)
            .then(items => storageDispatch({ type: 'setStorageToLocalContext', items }))
    }, [])

    return (
        <StorageContext.Provider value={{ storage, storageDispatch }}>
            {children}
        </StorageContext.Provider>
    )

}

