/**
 * Use to minimize the chatOverlay
 */

import React, { useContext } from 'react'
import { Chat, ChatBubbleOutline } from '@material-ui/icons'
import { StorageContext } from '../contexts/StorageContext'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useFullscreenState } from '../hooks/useFullscreenState'

const useStyles = makeStyles({
    container: {
        position: 'fixed',
        right: 20,
        bottom: 200
    },
    scale: {
        '& svg': {
            fontSize: 30
        }
    },
})




export const Minimize: React.FC = () => {
    const { storage: { show: showOverlay }, storageDispatch } = useContext(StorageContext)
    const classes = useStyles()
    const { isFullscreen } = useFullscreenState()

    return (
        <div className={classes.container}>
            {
                isFullscreen
                    ?
                    <></>
                    :
                    <IconButton className={classes.scale} size='medium' id={'yt-chat-icon-show'} aria-label='show chatoverlay' onClick={() => storageDispatch({ type: 'showOverlayOrNot', show: !showOverlay })} >
                        {showOverlay ? <Chat /> : <ChatBubbleOutline />}
                    </IconButton>
            }
        </div>
    )
}

