import React, { useState, useContext, useEffect, HTMLAttributes, DetailedHTMLProps, useMemo } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Modal, Typography, Paper, IconButton } from '@material-ui/core'
import { Done, MoreHoriz as More, PanTool } from '@material-ui/icons'
import { StorageContext } from '../contexts/StorageContext'
import { useFullscreenState } from '../hooks/useFullscreenState'
import { MySlider } from './MySlider'
import { MyButton } from './MyButton'

export interface IControlProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    movableTriggerId: string

}

const useStyles = makeStyles((theme) => createStyles({
    control: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: '20px'
    },
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
    margin: {
        margin: theme.spacing(1),
    },
}))

export const ToolBar: React.FC<IControlProps> = (props) => {

    const { storage: { fontSize, opacity, blur, show }, storageDispatch } = useContext(StorageContext)
    const [showModal, setShowModal] = useState<boolean>(false)
    const { isFullscreen } = useFullscreenState()
    const maxFontSize = 28,
        minFontSize = 8


    const classes = useStyles()
    const showApp = useMemo(() => (show && isFullscreen), [isFullscreen, show])


    const FontValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeFontSize', fontSize: newValue as number })
    }

    const OpacityValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number })
    }

    const BlurValueOnChange = (_: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeBackgroundBlur', blur: newValue as number })

    }


    useEffect(() => { if (!showApp) setShowModal(false) }, [showApp])

    const { movableTriggerId, className } = props

    return (
        <Paper className={`${className} ${classes.control} ${props.className || ''}`} elevation={3}>
            <IconButton id={movableTriggerId} aria-label='move' >
                <PanTool />
            </IconButton>
            <IconButton aria-label='more' onClick={() => setShowModal(true)}>
                <More />
            </IconButton>
            <Modal
                hideBackdrop={true}
                onClose={() => setShowModal(false)}
                open={showApp && showModal}>
                <Paper className={classes.settings}>
                    <Typography gutterBottom color='textPrimary' variant='h5'>Font Size</Typography>
                    <MySlider
                        min={minFontSize}
                        max={maxFontSize}
                        step={1}
                        value={fontSize}
                        valueLabelDisplay='auto'
                        onChange={FontValueOnChange} />
                    <Typography gutterBottom color='textPrimary' variant='h5'>Opacity</Typography>
                    <MySlider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        valueLabelDisplay='auto'
                        onChange={OpacityValueOnChange} />
                    <Typography gutterBottom color='textPrimary' variant='h5'>Blur</Typography>
                    <MySlider
                        min={0}
                        max={30}
                        step={1}
                        value={blur}
                        valueLabelDisplay='auto'
                        onChange={BlurValueOnChange} />
                    <MyButton className={classes.doneButton}
                        startIcon={<Done />}
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={() => { setShowModal(false) }}>Done</MyButton>
                </Paper>
            </Modal>
        </Paper>
    )

}
