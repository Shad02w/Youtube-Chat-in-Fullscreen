import { Paper } from '@material-ui/core'
import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { Message } from './Message'

interface LiveChatMembershipItemProps {
    renderer: YTLiveChat.LiveChatMembershipItemRenderer
    classes: LiveChatMessageStyleType
}

const bodyStyle: React.CSSProperties = {
    backgroundColor: '#0F9D58',
    color: '#fff'
}

export const LiveChatMembershipItem: React.FC<LiveChatMembershipItemProps> = ({ renderer, classes }) => {
    const headerStyle: React.CSSProperties = {
        backgroundColor: renderer.message ? '#0A8043' : '#0F9D58',
        color: '#fff'
    }

    return (
        <Paper className={classes.card} style={bodyStyle}>
            <article className={classes.cardHeader} style={headerStyle}>
                <article className={classes.cardHeaderImageContainer}>
                    <img
                        className={`${classes.cardHeaderImage} ${classes.authorImage}`}
                        src={renderer.authorPhoto.thumbnails[1].url}
                        alt="author icon"
                    />
                </article>
                <article>
                    <div className={`${classes.bold} ${classes.cardHeaderAuthorName}`}>{renderer.authorName.simpleText}</div>
                    {renderer.headerPrimaryText && <Message message={renderer.headerPrimaryText} classes={classes} />}
                    {renderer.headerSubtext && (
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }} className={`${classes.bold} ${classes.cardHeaderHighlight}`}>
                            <Message message={renderer.headerSubtext} classes={classes} />
                        </div>
                    )}
                </article>
            </article>
            {renderer.message && (
                <article className={classes.cardMessage}>
                    <Message message={renderer.message} classes={classes} />
                </article>
            )}
        </Paper>
    )
}
