import React, { createContext, useEffect, useReducer } from 'react'
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
        type: 'changeBackgroundBlur', blur: number
    } |
    {
        type: 'updateStorageChangesToLocalContext', changes: Partial<StorageItems>
    } | {
        type: 'toggleOverlay'
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
        case 'changeOverlayPosition':
            chrome.storage.local.set({ 'top': action.position.top })
            chrome.storage.local.set({ 'left': action.position.left })
            return { ...preState, top: action.position.top, left: action.position.left }
        case 'changeOverlaySize':
            chrome.storage.local.set({ 'width': action.size.width })
            chrome.storage.local.set({ 'height': action.size.height })
            return { ...preState, width: action.size.width, left: action.size.width }
        case 'changeBackgroundBlur':
            chrome.storage.local.set({ 'blur': action.blur })
            return { ...preState, blur: action.blur }
        case 'toggleOverlay':
            chrome.storage.local.set({ 'show': !preState.show })
            return { ...preState, show: !preState.show }
        case 'updateStorageChangesToLocalContext':
            return { ...preState, ...action.changes }
        default:
            throw new Error()
    }

}


export const StorageContextProvider: React.FC = ({ children }) => {

    const [storage, storageDispatch] = useReducer(storageContextReducer, StoragePreset)

    const getAllStorage = (items: any) => {
        storageDispatch({ type: 'updateStorageChangesToLocalContext', changes: items as StorageItems })
    }



    useEffect(() => {
        chrome.storage.local.get(null, getAllStorage)
    }, [])

    return (
        <StorageContext.Provider value={{ storage, storageDispatch }}>
            {children}
        </StorageContext.Provider>
    )

}

