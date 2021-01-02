import React from 'react'
import { Badges } from './Badges'
import { Message } from './Message'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { Box } from '@material-ui/core'
import { Build, Check } from '@material-ui/icons'


interface LiveChatTextMessageProps {
    classes: LiveChatMessageStyleType
    renderer: YTLiveChat.LiveChatTextMessageRenderer
}

const checkIdentity = (badges: YTLiveChat.AuthorBadge[] | undefined, type: YTLiveChat.IconType) => {
    return (badges
        && badges.some(badge => (badge.liveChatAuthorBadgeRenderer && badge.liveChatAuthorBadgeRenderer.icon && badge.liveChatAuthorBadgeRenderer.icon.iconType && badge.liveChatAuthorBadgeRenderer.icon.iconType === type))
    )
}

const isMember = (badges: YTLiveChat.AuthorBadge[] | undefined) => {
    return (badges
        && badges.some(badge => badge.liveChatAuthorBadgeRenderer.customThumbnail))

}

export const LiveChatTextMessage: React.FC<LiveChatTextMessageProps> = ({ renderer, classes }) => {
    const badges = renderer.authorBadges
    const message = renderer.message
    const isOwner = checkIdentity(badges, 'OWNER')
    const isMod = checkIdentity(badges, 'MODERATOR')
    const isVerified = checkIdentity(badges, 'VERIFIED')
    const isMem = isMember(badges)

    return (
        <div
            className={classes.textMessage}>
            <img
                alt="Author icon"
                className={classes.authorImage}
                src={renderer.authorPhoto.thumbnails[1].url}
            />
            <article>
                <div
                    className={`${classes.authorName} ${isMem ? classes.isMember : ''} ${isMod ? classes.isMod : ''} ${isOwner ? classes.isAuthor : ''}`}>
                    <div className={classes.autherNameInner}>
                        <Box pr={0.5}>
                            {renderer.authorName.simpleText}
                        </Box>
                        {
                            (isMod)
                                ?
                                <Box>
                                    <Build fontSize='default' />
                                </Box>
                                : <></>
                        }
                        {

                            (isVerified)
                                ?
                                <Box>
                                    <Check fontSize='default' />
                                </Box>
                                : <></>
                        }
                    </div>
                </div>
                {badges ? <Badges badges={badges}
                    classes={classes} /> : <></>}
                {message ? <Message message={message}
                    classes={classes} /> : <></>}
            </article>
        </div>
    )
}
