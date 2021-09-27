import React from 'react'
import { Badges } from './Badges'
import { Message } from './Message'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { Box } from '@material-ui/core'
import { Build, Check } from '@material-ui/icons'
import { isMember, checkBadgeType } from '@models/ChatFilter'

interface LiveChatTextMessageProps {
    classes: LiveChatMessageStyleType
    renderer: YTLiveChat.LiveChatTextMessageRenderer
}

export const LiveChatTextMessage: React.FC<LiveChatTextMessageProps> = ({ renderer, classes }) => {
    const badges = renderer.authorBadges
    const message = renderer.message
    const isOwner = checkBadgeType(badges, 'OWNER')
    const isMod = checkBadgeType(badges, 'MODERATOR')
    const isVerified = checkBadgeType(badges, 'VERIFIED')
    const isMem = isMember(badges)

    try {
        return (
            <div className={classes.textMessage}>
                <img alt="Author icon" className={classes.authorImage} src={renderer.authorPhoto.thumbnails[1].url} />
                <article>
                    <div className={classes.autherDetail}>
                        <div
                            className={`${classes.authorName} ${isMem ? classes.isMember : ''}  ${isMod ? classes.isMod : ''} ${
                                isOwner ? classes.isAuthor : ''
                            } ${!isMod && !isOwner && isVerified ? classes.isAuthor : ''}`}
                        >
                            <div className={classes.autherNameInner}>
                                <Box pr={0.5}>{renderer.authorName.simpleText}</Box>
                                {isMod ? (
                                    <Box>
                                        <Build fontSize="default" />
                                    </Box>
                                ) : (
                                    <></>
                                )}
                                {isVerified ? (
                                    <Box>
                                        <Check fontSize="default" />
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        {badges ? <Badges badges={badges} classes={classes} /> : <></>}
                    </div>
                    {message && <Message message={message} classes={classes} />}
                </article>
            </div>
        )
    } catch (error) {
        return <React.Fragment />
    }
}
