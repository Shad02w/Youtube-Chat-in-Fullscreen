import React, { useState, HTMLAttributes, DetailedHTMLProps, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import { Settings, PanTool, FilterList } from '@material-ui/icons';
import { SettingsModal } from './settings/SettingsModal'
import { PopupSettings } from './PopupSettings';

export interface IControlProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    movableTriggerId: string;
}

const useStyles = makeStyles({
    leftBtnsContainer: {
        borderRadius: 18,
        // backgroundColor: 'rgba(255,255,255,0.2)',
        // backdropFilter: 'blur(3px)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    rightBtnsContainer: {
        marginLeft: 'auto'
    },
    showBtn: {
        width: 15,
        height: 15,
        transition: 'all 200ms ease-in-out'
    },
})

export const ToolBar: React.FC<IControlProps> = (props) => {
    const [showModal, setShowModal] = useState(false)
    const [showPopup, setShowPopup] = useState(false)

    const togglePopup = useCallback(() => setShowPopup(pre => !pre), [setShowPopup])

    const classes = useStyles();

    const { movableTriggerId, className } = props;

    return (
        <Box>
            <Box
                display='flex'
                pt={'5px'}
                pb={'5px'}
                pr={1}
                pl={1}
                flexDirection='row'
                flexWrap='nowrap'
                alignItems='center'
                className={`${className || ''} noselect`}>
                <div className={classes.leftBtnsContainer}>
                    <IconButton
                        id={movableTriggerId}
                        // size='small'
                        aria-label="move"
                    >
                        <PanTool />
                    </IconButton>
                    <IconButton
                        aria-label="more"
                        // size='small'
                        onClick={() => setShowModal(true)}
                    >
                        <Settings />
                    </IconButton>
                </div>
                <Box marginLeft='auto'>
                    <IconButton
                        aria-label='filter'
                        onClick={togglePopup}
                    >
                        <FilterList />
                    </IconButton>
                </Box>
            </Box>
            <SettingsModal show={showModal}
                onClose={() => setShowModal(false)} />
            <PopupSettings
                show={showPopup}
                onClose={() => setShowPopup(false)}
            />
        </Box>
    );
};
