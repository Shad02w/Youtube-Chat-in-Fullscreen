import { AppContext } from '@contexts/AppContext'
import { StorageContext } from '@contexts/StorageContext'
import React, { useContext } from 'react'
import { ChatList } from './ChatList'


interface ReformedChatProps {
    className: string | undefined
}

export const ReformedChat: React.FC<ReformedChatProps> = ({ className }) => {

    const { storage: { chatFilter, fontSize, opacitySC, separateLine } } = useContext(StorageContext)
    const { chatActions, freezeChatQueue } = useContext(AppContext)
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

