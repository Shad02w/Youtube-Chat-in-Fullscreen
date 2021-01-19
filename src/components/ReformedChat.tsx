import { AppContext } from '@contexts/AppContext'
import { ChatContext } from '@contexts/ChatContext'
import { StorageContext } from '@contexts/StorageContext'
import React, { useContext, useEffect, useMemo } from 'react'
import { ChatList } from './ChatList'


interface ReformedChatProps {
    className?: string
}

export const ReformedChat: React.FC<ReformedChatProps> = ({ className }) => {

    const { storage: { chatFilter, fontSize, opacitySC, separateLine } } = useContext(StorageContext)
    const { setShowOverlay } = useContext(AppContext)
    const { chatActions, freezeChatQueue, pageType } = useContext(ChatContext)
    const show = useMemo(() => pageType !== 'normal' && chatActions.length > 0, [pageType, chatActions])

    useEffect(() => {
        if (show === undefined) return
        setShowOverlay(show)
    }, [show, setShowOverlay])

    return (
        <ChatList
            chatFilter={chatFilter}
            chatActions={chatActions}
            fontSize={fontSize}
            opacitySC={opacitySC}
            separateLine={separateLine}
            onAutoScrollStart={() => freezeChatQueue(false)}
            onAutoScrollStop={() => freezeChatQueue(true)}
            className={className ? className : ''}
        />
    )
}

