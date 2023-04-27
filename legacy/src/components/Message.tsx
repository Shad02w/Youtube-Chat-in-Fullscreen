import React from 'react'
import { LiveChatMessageStyleType } from '../styles/ChatListItem.style'

interface MessageProps {
    classes: LiveChatMessageStyleType
    message: YTLiveChat.Message | YTLiveChat.Text
}

export const Message: React.FC<MessageProps> = React.memo(({ classes, message }: MessageProps) => {
    return (
        <span className={classes.message}>
            {'runs' in message
                ? message.runs.map((run, i) => {
                      const thumbnail = run.emoji?.image?.thumbnails?.[1] ?? run.emoji?.image?.thumbnails?.[0] ?? null
                      if (run.text) return run.text
                      else if (thumbnail) {
                          return <img key={i} className={classes.emoji} src={thumbnail.url} alt="emoji" />
                      }
                      return null
                  })
                : message.simpleText}
        </span>
    )
})
