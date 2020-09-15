import React, { useState, useContext, useEffect, HTMLAttributes, DetailedHTMLProps } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Modal, Typography, Slider, Button, Paper, IconButton } from '@material-ui/core'
import { Done, MoreHoriz as More, PanTool } from '@material-ui/icons'
import { StorageContext } from './StorageContext'
import { AppContext } from './AppContext'

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
        // backdropFilter: 'blur(10px)',
        borderRadius: 20
    },
    doneButton: {
        marginTop: theme.spacing(2),
        fontSize: '1.3rem',
    },
    margin: {
        margin: theme.spacing(1),
    },
}))

export const Control: React.FC<IControlProps> = (props) => {

    const { storage: { fontSize, opacity, blur }, storageDispatch } = useContext(StorageContext)
    const { show: showApp } = useContext(AppContext)
    const [showModal, setShowModal] = useState<boolean>(false)

    const classes = useStyles()


    const FontValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeFontSize', fontSize: newValue as number })
    }

    const OpacityValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number })
    }

    const BlurValueOnChanage = (_: any, newValue: number | number[]) => {
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
                    <Slider
                        min={1}
                        max={4}
                        step={0.1}
                        value={fontSize}
                        defaultValue={fontSize}
                        valueLabelDisplay='auto'
                        onChange={FontValueOnChange} />
                    <Typography gutterBottom color='textPrimary' variant='h5'>Opacity</Typography>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        defaultValue={opacity}
                        valueLabelDisplay='auto'
                        onChange={OpacityValueOnChange} />
                    <Typography gutterBottom color='textPrimary' variant='h5'>Blur</Typography>
                    <Slider
                        min={0}
                        max={30}
                        step={1}
                        value={blur}
                        defaultValue={blur}
                        valueLabelDisplay='auto'
                        onChange={BlurValueOnChanage} />
                    <Button className={classes.doneButton}
                        startIcon={<Done />}
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={() => { setShowModal(false) }}>Done</Button>
                </Paper>
            </Modal>
        </Paper>
    )

}
