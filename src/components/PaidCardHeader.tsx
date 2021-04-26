import { LiveChatMessageStyleType } from '@/styles/ChatListItem.style'
import { rgbaToRgbaString, AndroidColorToRgba } from '@models/Color'
import React from 'react'

interface PaidCardHeaderProps {
    classes: LiveChatMessageStyleType,
    style?: React.CSSProperties
    authorPhoto: YTLiveChat.AuthorPhoto
    authorName: YTLiveChat.AuthorName
    purchaseAmountText: YTLiveChat.Text
    authorNameTextColor: number

}

export const PaidCardHeader: React.FC<PaidCardHeaderProps> = (props) => {
    const { classes, style, authorPhoto, authorName, purchaseAmountText, authorNameTextColor } = props
    return (
        <article className={classes.cardHeader}
            style={style}>
            <article className={classes.cardHeaderImageContainer}>
                <img
                    className={`${classes.authorImage} ${classes.cardHeaderImage}`}
                    src={authorPhoto.thumbnails[1].url}
                    alt="author icon" />
            </article>
            <article>
                {/*Author name*/}
                <div
                    style={{
                        color: rgbaToRgbaString(AndroidColorToRgba(authorNameTextColor))
                    }}
                    className={`${classes.bold} ${classes.cardHeaderAuthorName}`}
                >
                    {authorName.simpleText}
                </div>
                {/*Price*/}
                <div
                    className={`${classes.bold} ${classes.cardHeaderHighlight}`}>
                    {purchaseAmountText.simpleText}
                </div>
            </article>
        </article>
    )
}

