import React from 'react'
import { Badges } from './Badges'
import { Message } from './Message'
import { LiveChatMessageStyleType } from '../styles/ChatList.style'

interface LiveChatTextMessageProps {
    classes: LiveChatMessageStyleType
    renderer: YTLiveChat.LiveChatTextMessageRenderer
}


export const LiveChatTextMessage: React.FC<LiveChatTextMessageProps> = ({ renderer, classes }) => {
    const badges = renderer.authorBadges
    const message = renderer.message

    return (
        <div className={classes.textMessage}>
            <img
                alt="Author icon"
                className={classes.authorImage}
                src={renderer.authorPhoto.thumbnails[1].url}
            />
            <article>
                <div className={`${classes.authorName} ${(!badges) ? '' : classes.isMember}`}>{renderer.authorName.simpleText}</div>
                {badges ? <Badges badges={badges} classes={classes} /> : <></>}
                {message ? <Message message={message} classes={classes} /> : <></>}
            </article>
        </div>
    )
}