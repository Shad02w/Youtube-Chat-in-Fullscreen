import React, { useState, HTMLAttributes, DetailedHTMLProps } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton } from '@material-ui/core';
import { MoreHoriz as More, PanTool } from '@material-ui/icons';
import { SettingsModal } from './settings/SettingsModal'
import arrow from '../assets/images/arrowRight.svg'

export interface IControlProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    movableTriggerId: string;
}

const toolbarWidth = 80
const margin = 10
const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: margin,
        marginTop: margin,
        transition: 'all 150ms ease-in-out'
    },
    showToolbar: {
        transform: `translate(0px,0px)`
    },
    hideToolbar: {
        transform: `translate(${toolbarWidth + margin}px,0px)`
    },
    showBtnContainer: {
        padding: 10,
        marginRight: 8,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(3px)',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    showBtn: {
        width: 15,
        height: 15,
        transition: 'all 200ms ease-in-out'
    },
    rotate: {
        paddingLeft: 3,
        transform: 'rotate(180deg)'
    },
    noRotate: {
        paddingLeft: 3,
        transform: 'rotate(0deg)'
    },
    control: {
        width: toolbarWidth,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: '20px',
        justifyContent: 'center'
    }
})

export const ToolBar: React.FC<IControlProps> = (props) => {
    const [showModal, setShowModal] = useState(false)
    const [show, setShow] = useState(false)
    const classes = useStyles();

    const { movableTriggerId, className } = props;

    // useEffect(() => {
    //     setShow(false)
    // }, [showModal])

    return (
        <div className={`${className || ''} ${'noselect'} ${classes.container} ${show ? classes.showToolbar : classes.hideToolbar}`}>
            <div
                className={classes.showBtnContainer}
                onClick={() => setShow(pre => !pre)}>
                <img src={arrow}
                    className={`${classes.showBtn} ${show ? classes.noRotate : classes.rotate}`}
                    alt="show and hide tool bar" />
            </div>
            <Paper className={`${classes.control}`}
                elevation={3}>
                <IconButton id={movableTriggerId}
                    aria-label="move">
                    <PanTool />
                </IconButton>
                <IconButton aria-label="more"
                    onClick={() => setShowModal(true)}>
                    <More />
                </IconButton>
                <SettingsModal show={showModal}
                    onClose={() => setShowModal(false)} />
            </Paper>
        </div>
    );
};
