import { Paper } from '@material-ui/core'
import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { AndroidColorToRgba, rgbaToRgbaString } from '../models/Color'
import { Message } from './Message'
import { PaidCardHeader } from './PaidCardHeader'

interface LiveChatPaidMessageProps {
    renderer: YTLiveChat.LiveChatPaidMessageRenderer
    classes: LiveChatMessageStyleType
}

export const LiveChatPaidMessage: React.FC<LiveChatPaidMessageProps> = ({ renderer, classes }) => {
    const bodyStyle: React.CSSProperties = {
        backgroundColor: rgbaToRgbaString(AndroidColorToRgba(renderer.bodyBackgroundColor)),
        color: rgbaToRgbaString(AndroidColorToRgba(renderer.bodyTextColor))
    }
    const headerStyle: React.CSSProperties = {
        backgroundColor: rgbaToRgbaString(AndroidColorToRgba(renderer.headerBackgroundColor)),
        color: rgbaToRgbaString(AndroidColorToRgba(renderer.headerTextColor))
    }

    return (
        <Paper elevation={2} className={classes.card}
style={bodyStyle}>
            <PaidCardHeader
                style={headerStyle}
                classes={classes}
                authorName={renderer.authorName}
                authorPhoto={renderer.authorPhoto}
                authorNameTextColor={renderer.authorNameTextColor}
                purchaseAmountText={renderer.purchaseAmountText}
            />
            {renderer.message ? (
                <article className={classes.cardMessage}>
                    <Message message={renderer.message} classes={classes} />
                </article>
            ) : (
                <></>
            )}
        </Paper>
    )
}
