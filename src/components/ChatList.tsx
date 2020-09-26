import React, { useContext, useEffect, useRef, useMemo } from 'react'
import { StorageContext } from '../contexts/StorageContext'
import { AppContext } from '../contexts/AppContext'
import { useLiveChatMessageStyle, useChatListStyles } from '../styles/ChatList.style'
import { LiveChatTextMessage } from './LiveChatTextMessage'
import { LiveChatPaidMessage } from './LiveChatPaidMessage'
import { LiveChatMembershipItem } from './LiveChatMembershipItem'

interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> {
}



export const ChatList: React.FC<IChatListProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const { chatActions } = useContext(AppContext)
    const { storage: { fontSize } } = useContext(StorageContext)
    const classes = useChatListStyles({ fontSize })
    const liveChatTextMessageClasses = useLiveChatMessageStyle()

    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        requestAnimationFrame(() => el.scrollTop = el.scrollHeight)
    })

    const createChatList = () => {
        let list: JSX.Element | JSX.Element[] = <></>
        try {
            list = chatActions
                .map((action) => {
                    const { liveChatMembershipItemRenderer, liveChatTextMessageRenderer, liveChatPaidMessageRenderer } = action.addChatItemAction!.item
                    if (liveChatTextMessageRenderer)
                        return <LiveChatTextMessage renderer={liveChatTextMessageRenderer} classes={liveChatTextMessageClasses}
                            key={action.uuid} />
                    else if (liveChatPaidMessageRenderer)
                        return <LiveChatPaidMessage key={action.uuid} renderer={liveChatPaidMessageRenderer} classes={liveChatTextMessageClasses} />
                    else if (liveChatMembershipItemRenderer)
                        return <LiveChatMembershipItem key={action.uuid} renderer={liveChatMembershipItemRenderer} classes={liveChatTextMessageClasses} />
                    else
                        return <React.Fragment key={action.uuid} />
                })
        } catch (error) {
            console.error(error)
        }
        return (
            <div className={classes.chatListContainer}>
                {list}
            </div>
        )
    }

    const ChatListMemo = useMemo(createChatList, [chatActions])

    return (
        <div
            ref={containerRef}
            className={`${props.className || ''} ${classes.container}`}>
            {ChatListMemo}
        </div>

    )
}



