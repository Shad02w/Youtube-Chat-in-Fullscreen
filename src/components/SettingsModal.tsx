import React, { useContext, useMemo, useEffect, useState } from 'react'
import { Done } from '@material-ui/icons'
import { Paper, Typography, Box, Dialog, DialogActions } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { MySlider } from './MySlider'
import { MyButton } from './MyButton'
import { StorageContext } from '../contexts/StorageContext'
import { useFullscreenState } from './hooks/useFullscreenState'
import { RgbColor, RgbColorPicker } from 'react-colorful'
import 'react-colorful/dist/index.css'
import '../css/colorful.css'

interface SettingsModelProps {
    show: boolean
    onClose: () => void
}

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        background: 'transparent'
    },
    container: {
        padding: 30,
        background: 'rgba(20, 20, 20, 0.8)',
        borderRadius: 20,
        width: '700px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr auto',
        gridGap: '20px'
    },
    actions: {
        gridColumnStart: 1,
        gridColumnEnd: 3
    },
    doneButton: {
        marginTop: theme.spacing(2),
        fontSize: '1.3rem',
    },
}))

export const SettingsModal: React.FC<SettingsModelProps> = ({ show, onClose }) => {

    const { isFullscreen } = useFullscreenState()
    const { storage: { fontSize, opacity, blur, show: showOverlay_Storage, opacitySC, color }, storageDispatch, } = useContext(StorageContext);
    const showApp = useMemo(() => showOverlay_Storage && isFullscreen, [isFullscreen, showOverlay_Storage]);

    const classes = useStyles()

    const maxFontSize = 28,
        minFontSize = 8;

    const FontValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeFontSize',
            fontSize: newValue as number,
        });
    };

    const OpacityValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number });
    };

    const OpacitySCValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacitySC', opacitySC: newValue as number });
    };

    const BlurValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeBackgroundBlur',
            blur: newValue as number,
        });
    };

    const ColorValueOnChange = (c: RgbColor) => {
        storageDispatch({ type: 'changeColor', color: c })
    }

    useEffect(() => {
        if (!showApp) onClose()
    }, [showApp, onClose])


    return (
        <Dialog
            classes={{
                paper: classes.paper
            }}
            hideBackdrop={true}
            maxWidth='lg'
            onClose={onClose}
            open={showApp && show}>
            {/* <Paper className={classes.settings}> */}
            <Paper className={classes.container}>
                <Box>
                    <Typography gutterBottom
                        color="textPrimary"
                        variant="h5">
                        Font Size
                    </Typography>
                    <MySlider
                        min={minFontSize}
                        max={maxFontSize}
                        step={1}
                        value={fontSize}
                        valueLabelDisplay="auto"
                        onChange={FontValueOnChange}
                    />
                    <Typography gutterBottom
                        color="textPrimary"
                        variant="h5">
                        Opacity
                    </Typography>
                    <MySlider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        valueLabelDisplay="auto"
                        onChange={OpacityValueOnChange}
                    />
                    <Typography gutterBottom
                        color="textPrimary"
                        variant="h5">
                        Opacity for Super Chat
                    </Typography>
                    <MySlider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacitySC}
                        valueLabelDisplay="auto"
                        onChange={OpacitySCValueOnChange}
                    />
                    <Typography gutterBottom
                        color="textPrimary"
                        variant="h5">
                        Blur
                    </Typography>
                    <MySlider
                        min={0}
                        max={30}
                        step={1}
                        value={blur}
                        valueLabelDisplay="auto"
                        onChange={BlurValueOnChange}
                    />
                    <br />
                    <Typography
                        gutterBottom
                        variant='h6'>
                        Use <code>Ctrl+Alt+c</code> to toggle overlay
                    </Typography>
                    <Typography
                        gutterBottom
                        variant='h6'>
                        Press <code>Ctrl+Alt</code> then drag to move overlay
                    </Typography>
                </Box>
                <Box minHeight={300}>
                    <Typography gutterBottom
                        color="textPrimary"
                        variant="h5">
                        Background Color
                    </Typography>
                    <Typography gutterBottom
                        color="textSecondary"
                        variant='h6'>
                        Current Color: {`rgb(${color.r}, ${color.g}, ${color.b})`}
                    </Typography>
                    <RgbColorPicker
                        color={color}
                        onChange={ColorValueOnChange}
                    />
                </Box>
                <DialogActions
                    className={classes.actions}
                >
                    <MyButton
                        className={classes.doneButton}
                        startIcon={<Done />}
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={onClose}
                    >
                        Done
                    </MyButton>
                </DialogActions>
            </Paper>
        </Dialog>
    )
}

