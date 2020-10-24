import React from 'react'
import { Badges } from './Badges'
import { Message } from './Message'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'


interface LiveChatTextMessageProps {
    classes: LiveChatMessageStyleType
    renderer: YTLiveChat.LiveChatTextMessageRenderer
}

const isOwner = (badges: YTLiveChat.AuthorBadge[] | undefined) => {
    return (badges
        && badges.some(badge => (badge.liveChatAuthorBadgeRenderer && badge.liveChatAuthorBadgeRenderer.icon && badge.liveChatAuthorBadgeRenderer.icon.iconType && badge.liveChatAuthorBadgeRenderer.icon.iconType === 'OWNER'))
    )
}

const isMember = (badges: YTLiveChat.AuthorBadge[] | undefined) => {
    return (badges
        && badges.some(badge => badge.liveChatAuthorBadgeRenderer.customThumbnail))

}

export const LiveChatTextMessage: React.FC<LiveChatTextMessageProps> = ({ renderer, classes }) => {
    const badges = renderer.authorBadges
    const message = renderer.message

    return (
        <div
            className={classes.textMessage}>
            <img
                alt="Author icon"
                className={classes.authorImage}
                src={renderer.authorPhoto.thumbnails[1].url}
            />
            <article>
                <div className={`${classes.authorName} ${(isMember(badges)) ? classes.isMember : ''} ${isOwner(badges) ? classes.isAuthor : ''}`}>{renderer.authorName.simpleText}</div>
                {badges ? <Badges badges={badges}
                    classes={classes} /> : <></>}
                {message ? <Message message={message}
                    classes={classes} /> : <></>}
            </article>
        </div>
    )
}
