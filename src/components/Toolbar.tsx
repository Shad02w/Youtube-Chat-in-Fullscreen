import React, { useState, useCallback, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Paper } from '@material-ui/core'
import { Settings, PanTool, FilterList } from '@material-ui/icons'
import { SettingsModal } from './settings/SettingsModal'
import { PopupSettings } from './PopupSettings'
import { StorageContext } from '@contexts/StorageContext'

export interface IControlProps {
    movableTriggerId: string
    className?: string
    style?: React.CSSProperties
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexFlow: 'row nowrap',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        background: '#212121',
        height: 40,
        borderRadius: 40,
        transition: 'all 250ms cubic-bezier(0,.57,.81,1.32)',
    },
})

// TODO: show the toolbar when hover to the chat overlay
export const ToolBar: React.FC<IControlProps> = props => {
    const [showModal, setShowModal] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const {
        storage: {
            size: { width },
        },
    } = useContext(StorageContext)

    const togglePopup = useCallback(() => setShowPopup(pre => !pre), [setShowPopup])

    const classes = useStyles()

    const { movableTriggerId, className, style } = props

    // need to remove

    // close Popup settings after the toolbar transition
    const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = e => {
        if (e.target === e.currentTarget) {
            setShowPopup(false)
        }
    }

    return (
        <Paper
            onTransitionEnd={handleTransitionEnd}
            elevation={5}
            style={style}
            className={`${classes.container} noselect ${className || ''} ycf-toolbar`}
        >
            <IconButton id={movableTriggerId} aria-label="move">
                <PanTool />
            </IconButton>
            <IconButton aria-label="more" onClick={() => setShowModal(true)}>
                <Settings />
            </IconButton>
            <IconButton aria-label="filter" onClick={togglePopup}>
                <FilterList />
            </IconButton>
            <SettingsModal show={showModal} onClose={() => setShowModal(false)} />
            <PopupSettings width={width} show={showPopup} onClose={() => setShowPopup(false)} />
        </Paper>
    )
}
