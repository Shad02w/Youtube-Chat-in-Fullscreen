import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'

interface MessageProps {
    classes: LiveChatMessageStyleType
    message: YTLiveChat.Message

}

export const Message: React.FC<MessageProps> = ({ classes, message }) => {
    return (
        <span className={classes.message}>
            {
                message.runs.map((run, i) => {
                    if (run.text)
                        return run.text
                    else if (run.emoji)
                        return <img key={i}
                            className={classes.emoji}
                            src={run.emoji.image.thumbnails[1].url}
                            alt="emoji" />
                    return <></>
                })
            }
        </span>
    )
}

