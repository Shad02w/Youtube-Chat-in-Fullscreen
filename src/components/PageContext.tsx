import React, { createContext, useState, useEffect } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { CatchedLiveChatRequestMessage } from '../models/request'

interface IPageContext {
    pageId: string
}

export const PageContext = createContext<IPageContext>({ pageId: 'undefined' })

export const PageContextProvider: React.FC = ({ children }) => {

    const [pageId, setPageId] = useState<string>(uuidV4())

    const videoPageRequestListener = (message: CatchedLiveChatRequestMessage) => { if (message.type === 'video-page') setPageId(uuidV4()) }

    useEffect(() => {
        chrome.runtime.onMessage.addListener(videoPageRequestListener)
        return () => chrome.runtime.onMessage.removeListener(videoPageRequestListener)
    }, [])

    return (
        <PageContext.Provider value={{ pageId }}>
            {children}
        </PageContext.Provider>
    )
}

