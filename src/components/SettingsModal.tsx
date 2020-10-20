import React, { useContext, useMemo, useEffect } from 'react'
import { Done } from '@material-ui/icons'
import { Modal, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { MySlider } from './MySlider'
import { MyButton } from './MyButton'
import { StorageContext } from '../contexts/StorageContext'
import { useFullscreenState } from './hooks/useFullscreenState'

interface SettingsModelProps {
    show: boolean
    onClose: () => void
}

const useStyles = makeStyles((theme) => createStyles({
    settings: {
        outline: 'none',
        position: 'absolute',
        width: 300,
        height: 'auto',
        padding: 30,
        top: '50%',
        left: '50%',
        marginLeft: '-150px',
        marginTop: '-150px',
        background: 'rgba(20, 20, 20, 0.8)',
        borderRadius: 20,
    },
    doneButton: {
        marginTop: theme.spacing(2),
        fontSize: '1.3rem',
    },
}))

export const SettingsModal: React.FC<SettingsModelProps> = ({ show, onClose }) => {

    const { isFullscreen } = useFullscreenState()
    const { storage: { fontSize, opacity, blur, show: showOverlay_Storage }, storageDispatch, } = useContext(StorageContext);
    const showApp = useMemo(() => showOverlay_Storage && isFullscreen, [isFullscreen, showOverlay_Storage]);

    const classes = useStyles()

    const maxFontSize = 28,
        minFontSize = 8;

    const FontValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeFontSize',
            fontSize: newValue as number,
        });
    };

    const OpacityValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number });
    };

    const BlurValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({
            type: 'changeBackgroundBlur',
            blur: newValue as number,
        });
    };

    useEffect(() => {
        if (!showApp) onClose()
    }, [showApp, onClose])


    return (
        <Modal hideBackdrop={true}
            onClose={onClose}
            open={showApp && show}>
            <Paper className={classes.settings}>
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
            </Paper>
        </Modal>
    )
}

