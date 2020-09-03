import React, { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { FindObjectByKeyRecursively, ReplayRequest } from '../function'
import { CatchedLiveChatRequestMessage } from '../models/request'
import { ChatContext, ChatActionList } from './ChatContext'
import { v4 as uuidV4 } from 'uuid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { StorageContext } from './StorageContext'


interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> { }

interface ChatListStyleProps {
    fontSize: number
}

const useStyles = makeStyles<Theme, ChatListStyleProps>({
    container: {
        width: 'auto',
        height: 'auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(240, 240, 240, 0.3) transparent',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(240, 240, 240, 0.3)',
            borderRadius: '10px'
        }
    },
    chatListContainer: {
        padding: 10,
        maxHeight: '100%'
    },
    chatItem: {
        padding: '5px 10px',
        fontSize: props => props.fontSize,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center'
    },
    authorImage: {
        borderRadius: '50%',
        height: 25,
        width: 25,
        marginRight: 20
    },
    authorName: {
        marginRight: 10,
        fontWeight: 700,
        display: 'flex',
        flexFlow: 'row nowrap',
        minWidth: 'min-conent',
    },
    isMember: {
        color: 'green'
    },
    authorBadge: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    chatMessage: {
        overflowWrap: 'break-word',
        wordWrap: 'break-word'
    },
    downButton: {
        position: 'absolute',
        bottom: -50,
        margin: '0 auto',
        width: 30,
        height: 30,
        left: 0,
        right: 0,
        transition: 'all 150ms ease-in-out',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    downButtonShow: {
        bottom: 30,
    }
})


export const ChatList: React.FC<IChatListProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const { chatList, update: UpdateChatList, pageId } = useContext(ChatContext)
    const { storage: { fontSize } } = useContext(StorageContext)
    const pageIdRef = useRef(pageId)
    const classes = useStyles({ fontSize })
    pageIdRef.current = pageId

    async function LiveChatRequestListener(message: CatchedLiveChatRequestMessage) {
        if (message.type === 'video-page') return
        const { url } = message.details
        const requestBody = message.requestBody
        const data = await ReplayRequest(url, requestBody)
        if (!data) return
        const actions = FindObjectByKeyRecursively(data as Response, 'actions') as YoutubeLiveChat.LiveChatContinuationAction[]
        if (!actions) return
        // add uuid to each action
        const actionsWithUuid = actions.map((action) => ({
            ...action,
            uuid: uuidV4(),
            pageId: pageIdRef.current
        })) as ChatActionList
        // Do data false check before upate the hook
        const filteredActions = actionsWithUuid
            .filter(action => {
                return !(action.addChatItemAction === undefined
                    || action.addChatItemAction.item === undefined
                    || action.addChatItemAction.item.liveChatTextMessageRenderer === undefined);

            })

        // Gradually update the chat list
        const timeout = FindObjectByKeyRecursively(data as Response, 'timeoutMs') as number
        const tti = timeout || 5000
        const timeInterval = tti / filteredActions.length
        filteredActions.forEach((action, i) => setTimeout(() => {
            // check whether the chat action is come from previous page
            if (action.pageId === pageIdRef.current)
                UpdateChatList([action])
        }, i * timeInterval))
    }



    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        el.scrollTop = el.scrollHeight
    })

    useEffect(() => {
        chrome.runtime.onMessage.addListener(LiveChatRequestListener)
        return () => {
            chrome.runtime.onMessage.removeListener(LiveChatRequestListener)
        }
    }, [])

    const createBagde = (authorBadges: YoutubeLiveChat.LiveChatTextMessageRenderer.AuthorBadge[] | undefined) => {
        try {
            if (!authorBadges || authorBadges.length === 0) return <></>
            else if (!authorBadges[0].liveChatAuthorBadgeRenderer.customThumbnail) return <></>
            else {
                return authorBadges.map((badge, key) =>
                    <img key={key} className={classes.authorBadge}
                        src={badge.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails[0].url} alt="" />
                )
            }
        } catch (error) {
            console.error(error)
            return <></>
        }
    }

    const ChatList = () => {
        let list;
        if (chatList.length === 0)
            list = <></>
        else {
            list = chatList
                .map((action) => {
                    return (
                        <div className={classes.chatItem} key={action.uuid}>
                            <img className={classes.authorImage}
                                src={action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorPhoto.thumbnails[0].url}
                                alt="author Image" />
                            <div className={classes.authorName + ' ' +
                                (action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorBadges === undefined ? '' : classes.isMember)}>{action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorName.simpleText}</div>
                            {createBagde(action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorBadges)}
                            <div
                                className={classes.chatMessage}>{action.addChatItemAction!.item.liveChatTextMessageRenderer!.message.runs[0].text}</div>
                        </div>
                    )
                })
        }
        return (
            <div className={classes.chatListContainer}>
                {list}
            </div>
        )
    }

    const ChatListMemo = useMemo(() => ChatList(), [chatList])

    return (
        <div
            ref={containerRef}
            className={`${props.className || ''} ${classes.container}`}>
            {ChatListMemo}
        </div>

    )
}



