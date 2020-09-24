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
            chrome.storage.sync.set({ 'fontSize': action.fontSize })
            return { ...preState, fontSize: action.fontSize }
        case 'changeOpacity':
            chrome.storage.sync.set({ 'opacity': action.opacity })
            return { ...preState, opacity: action.opacity }
        case 'changeOverlayPosition':
            chrome.storage.sync.set({ 'top': action.position.top })
            chrome.storage.sync.set({ 'left': action.position.left })
            return { ...preState, top: action.position.top, left: action.position.left }
        case 'changeOverlaySize':
            chrome.storage.sync.set({ 'width': action.size.width })
            chrome.storage.sync.set({ 'height': action.size.height })
            return { ...preState, width: action.size.width, left: action.size.width }
        case 'changeBackgroundBlur':
            chrome.storage.sync.set({ 'blur': action.blur })
            return { ...preState, blur: action.blur }
        case 'toggleOverlay':
            chrome.storage.sync.set({ 'show': !preState.show })
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
        chrome.storage.sync.get(null, getAllStorage)
    }, [])

    return (
        <StorageContext.Provider value={{ storage, storageDispatch }}>
            {children}
        </StorageContext.Provider>
    )

}

