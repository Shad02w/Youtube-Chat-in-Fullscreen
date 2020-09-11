import React, { useContext, useEffect, useRef, useMemo } from 'react'
import { ChatContext } from './ChatContext'
import { makeStyles } from '@material-ui/core/styles'
import { StorageContext } from './StorageContext'


interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> { }

interface ChatListStyleProps {
    fontSize: number

}




// const useStyles = makeStyles<Theme, ChatListStyleProps>({
const useStyles = makeStyles({
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
        fontSize: (props: ChatListStyleProps) => props.fontSize,
        display: 'grid',
        gridTemplateColumns: '25px 1fr',
        gridGap: 20
    },
    authorImage: {
        borderRadius: '50%',
        height: 25,
        width: 25,
    },
    authorName: {
        marginRight: 10,
        fontWeight: 800,
        display: 'inline-block',
        wordBreak: 'break-all'
    },
    isMember: {
        color: 'green'
    },
    authorBadge: {
        width: 20,
        height: 20,
        marginRight: 5,
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    emoji: {
        width: 25,
    },
    chatMessage: {
        wordBreak: 'break-word'
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
    const { chatList } = useContext(ChatContext)
    const { storage: { fontSize } } = useContext(StorageContext)
    const classes = useStyles({ fontSize })




    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        el.scrollTop = el.scrollHeight
    })


    const createBagde = (authorBadges: YTLiveChat.AuthorBadge[] | undefined) => {
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

    const createMessage = (message: YTLiveChat.Message) => {
        return (
            <span className={classes.chatMessage}>
                {
                    message.runs.map(run => {
                        if (run.text)
                            return run.text
                        else if (run.emoji)
                            return <img key={(new Date().toString())} className={`${classes.authorBadge} ${classes.emoji}`} src={run.emoji.image.thumbnails[0].url} alt="emoji" />
                        return <></>
                    })
                }
            </span>
        )
    }


    const createChatList = () => {
        let list;
        if (chatList.length === 0)
            list = <></>
        else {
            list = chatList
                .map((action) => {
                    const badges = action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorBadges
                    const message = action.addChatItemAction!.item.liveChatTextMessageRenderer!.message
                    return (
                        <div className={classes.chatItem} key={action.uuid}>
                            <img
                                alt="Author icon"
                                className={classes.authorImage}
                                src={action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorPhoto.thumbnails[0].url}
                            />
                            <article>
                                <div className={`${classes.authorName} ${(badges === undefined) ? '' : classes.isMember}`}>{action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorName.simpleText}</div>
                                {createBagde(badges)}
                                {createMessage(message)}
                            </article>
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

    const ChatListMemo = useMemo(createChatList, [chatList])

    return (
        <div
            ref={containerRef}
            className={`${props.className || ''} ${classes.container}`}>
            {ChatListMemo}
        </div>

    )
}



