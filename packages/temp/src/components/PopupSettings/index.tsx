import React from 'react'
import { Paper, Box, Typography, IconButton, Slide } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Close } from '@material-ui/icons'
import { FilterSettings } from './FilterSettings'

interface PopupSettingsProps {
    show: boolean
    onClose: () => any
    width: number
}

interface StyleProps {
    width: number
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            position: 'absolute',
            boxSizing: 'border-box',
            width: ({ width }: StyleProps) => width - 25,
            maxWidth: '320px',
            backgroundColor: '#212121',
            padding: theme.spacing(1),
            bottom: 50,
            right: 0,
        },
        title: {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
        },
        closeBtn: {
            marginLeft: 'auto',
        },
    })
)

export const PopupSettings: React.FC<PopupSettingsProps> = ({ show, onClose, width }) => {
    const classes = useStyles({ width })

    return (
        <Slide onExit={onClose} in={show} direction="up" timeout={350} unmountOnExit>
            <Paper className={classes.container} elevation={5}>
                {/* title */}
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                    <Typography className={classes.title} variant="h5">
                        Chat Filter Settings
                    </Typography>
                    <IconButton className={classes.closeBtn} aria-label="Close pop up settings" onClick={onClose}>
                        <Close fontSize="large" />
                    </IconButton>
                </Box>
                <Box>
                    <FilterSettings />
                </Box>
            </Paper>
        </Slide>
    )
}
