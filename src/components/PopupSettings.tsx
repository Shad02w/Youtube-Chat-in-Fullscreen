import React from 'react'
import { Paper, Box, Typography, IconButton, Slide } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Close } from '@material-ui/icons'
import { FilterSettings } from '@components/settings/FilterSettings'

interface PopupSettingsProps {
    show: boolean
    onClose: () => any
}

const useStyles = makeStyles(theme => createStyles({
    container: {
        position: 'absolute',
        boxSizing: 'border-box',
        width: `calc(100% - ${theme.spacing(1)}* 2px)`,
        maxWidth: '320px',
        backgroundColor: '#212121',
        padding: theme.spacing(1),
        bottom: '50px',
        // marginLeft: 'auto',
        right: theme.spacing(1)
    },
    title: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
    },
    closeBtn: {
        marginLeft: 'auto'
    }
}))


export const PopupSettings: React.FC<PopupSettingsProps> = ({ show, onClose }) => {
    const classes = useStyles()
    return (
        <Slide
            onExit={onClose}
            in={show}
            direction='up'
            timeout={350}
        >
            <Paper
                className={classes.container}
                elevation={5}>
                {/* title */}
                <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Typography
                        className={classes.title}
                        variant='h5'
                    >
                        Chat Filter Settings
                            </Typography>
                    <IconButton
                        className={classes.closeBtn}
                        aria-label='Close pop up settings'
                        onClick={onClose}
                    >
                        <Close
                            fontSize='large'
                        />
                    </IconButton>
                </Box>
                <Box>
                    <FilterSettings />
                </Box>
            </Paper>
        </Slide>
    )
}

