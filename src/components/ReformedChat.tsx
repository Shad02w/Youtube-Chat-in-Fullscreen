import { AppContext } from '@contexts/AppContext'
import { ChatContext } from '@contexts/ChatContext'
import { StorageContext } from '@contexts/StorageContext'
import { useChatBox } from '@hooks/useChatBox'
import { useFullscreenState } from '@hooks/useFullscreenState'
import React, { useContext, useEffect, useMemo } from 'react'
import { ChatList } from './ChatList'


interface ReformedChatProps {
    className?: string
}

export const ReformedChat: React.FC<ReformedChatProps> = ({ className }) => {

    const { storage: { chatFilter, fontSize, opacitySC, separateLine } } = useContext(StorageContext)
    const { setShowOverlay } = useContext(AppContext)
    const { chatActions, freezeChatQueue, pageType } = useContext(ChatContext)
    const { isFullscreen } = useFullscreenState()
    const { storage: { show: showOverlay_storage } } = useContext(StorageContext)
    const { expanded } = useChatBox()
    const show = useMemo(() => (showOverlay_storage && isFullscreen && pageType !== 'normal' && chatActions.length > 0 && expanded === true), [chatActions, showOverlay_storage, isFullscreen, pageType, expanded])

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

