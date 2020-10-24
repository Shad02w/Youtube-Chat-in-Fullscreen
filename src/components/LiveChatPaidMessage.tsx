import { Paper } from '@material-ui/core'
import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'
import { AndroidColorToRgba, rgbaToRgbaString } from '../models/Color'
import '../css/App.css'
import { Message } from './Message'



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
        <Paper elevation={2}
            className={classes.card}
            style={bodyStyle} >
            <article className={classes.cardHeader}
                style={headerStyle}>
                <article className={classes.cardHeaderImageContainer}>
                    <img
                        className={`${classes.authorImage} ${classes.cardHeaderImage}`}
                        src={renderer.authorPhoto.thumbnails[1].url}
                        alt="author icon" />
                </article>
                <article>
                    {/*Author name*/}
                    <div
                        style={{
                            color: rgbaToRgbaString(AndroidColorToRgba(renderer.authorNameTextColor))
                        }}
                        className={`${classes.bold} ${classes.cardHeaderAuthorName}`}
                    >
                        {renderer.authorName.simpleText}
                    </div>
                    {/*Price*/}
                    <div
                        className={`${classes.bold} ${classes.cardHeaderHighlight}`}>
                        {renderer.purchaseAmountText.simpleText}
                    </div>
                </article>
            </article>
            {
                renderer.message
                    ?
                    <article className={classes.cardMessage}>
                        <Message message={renderer.message}
                            classes={classes} />
                    </article>
                    :
                    <></>
            }
        </Paper>
    )
}
