import { LiveChatMessageStyleType } from '@/styles/ChatListItem.style'
import { Box, Paper } from '@material-ui/core'
import { AndroidColorToRgba, rgbaToRgbaString } from '@models/Color'
import React from 'react'
import { PaidCardHeader } from './PaidCardHeader'

interface LiveChatPaidStickerRendererProps {
    classes: LiveChatMessageStyleType
    renderer: YTLiveChat.LiveChatPaidStickerRenderer

}


export const LiveChatPaidStickerRenderer: React.FC<LiveChatPaidStickerRendererProps> = (props) => {
    const { classes, renderer } = props

    try {
        return (
            <Paper
                style={{
                    backgroundColor: rgbaToRgbaString(AndroidColorToRgba(renderer.backgroundColor)),
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                }}
                elevation={2}
                className={classes.card}
            >
                <Box>
                    <PaidCardHeader
                        classes={classes}
                        authorName={renderer.authorName}
                        authorPhoto={renderer.authorPhoto}
                        authorNameTextColor={renderer.authorNameTextColor}
                        purchaseAmountText={renderer.purchaseAmountText}
                    />
                </Box>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    marginLeft='auto'
                >
                    <img
                        className={classes.sticker}
                        src={renderer.sticker.thumbnails[1].url}
                        alt={'sticker'}
                    />
                </Box>
            </Paper>
        )
    } catch (error) {
        return <React.Fragment />
    }
}

