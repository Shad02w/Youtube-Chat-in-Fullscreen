import React, { useState, HTMLAttributes, DetailedHTMLProps } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Paper, IconButton } from '@material-ui/core';
import { MoreHoriz as More, PanTool } from '@material-ui/icons';
import { SettingsModal } from './SettingsModal'

export interface IControlProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    movableTriggerId: string;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        control: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            borderRadius: '20px',
        }
    })
);

export const ToolBar: React.FC<IControlProps> = (props) => {
    const [showModal, setShowModal] = useState(false)
    const classes = useStyles();


    const { movableTriggerId, className } = props;

    return (
        <Paper className={`${className} ${classes.control} ${props.className || ''}`}
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
    );
};
