import { Paper } from '@material-ui/core'
import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { Message } from './Message'

interface LiveChatMembershipItemProps {
    renderer: YTLiveChat.LiveChatMembershipItemRenderer,
    classes: LiveChatMessageStyleType

}

export const LiveChatMembershipItem: React.FC<LiveChatMembershipItemProps> = ({ renderer, classes }) => {
    const bodyStyle: React.CSSProperties = {
        backgroundColor: '#0F9D58',
        color: '#fff'
    }
    return (
        <Paper className={classes.card}>
            <article className={classes.cardHeader}
                style={bodyStyle}>
                <article className={classes.cardHeaderImageContainer}>
                    <img className={`${classes.cardHeaderImage} ${classes.authorImage}`}
                        src={renderer.authorPhoto.thumbnails[1].url}
                        alt="author icon" />
                </article>
                <article>
                    <div
                        className={`${classes.bold} ${classes.cardHeaderAuthorName}`}
                    >
                        {renderer.authorName.simpleText}
                    </div>
                    <div
                        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        className={`${classes.bold} ${classes.cardHeaderHighlight}`}
                    >
                        <Message message={renderer.headerSubtext}
                            classes={classes} />
                    </div>
                </article>
            </article>
        </Paper>
    )
}
