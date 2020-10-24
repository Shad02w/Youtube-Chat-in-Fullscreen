import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'

interface BadgesProps {
    classes: LiveChatMessageStyleType
    badges: YTLiveChat.AuthorBadge[]
}

export const Badges: React.FC<BadgesProps> = ({ badges, classes }) => {
    try {
        if (!badges || badges.length === 0 || !badges[0].liveChatAuthorBadgeRenderer.customThumbnail) return <></>
        else {
            return (
                <>
                    {
                        badges.map((badge, key) =>
                            <img key={key}
                                className={classes.authorBadge}
                                src={badge.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails[1].url}
                                alt="member ship badge" />
                        )
                    }
                </>
            )
        }
    } catch (error) {
        console.error(error)
        return <></>
    }
}
