import React, { useState, useContext, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Done from '@material-ui/icons/Done'
import More from '@material-ui/icons/MoreHoriz'
import PanTool from '@material-ui/icons/PanTool'
import { StorageContext } from './StorageContext'
import { MovableTrigger } from './Movable'
import { ShowAppContext } from '../App'

export interface IControlProps extends React.HTMLAttributes<HTMLDivElement> { }

const useStyles = makeStyles((theme) => createStyles({
    control: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: '20px'
    },
    btn: {
        margin: '0px 10px',
        width: 30,
        height: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        background: 'rgba(203, 203, 203, 0.8)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    settings: {
        outline: 'none',
        position: 'absolute',
        width: 300,
        height: 'auto',
        padding: 50,
        top: '50%',
        left: '50%',
        marginLeft: '-150px',
        marginTop: '-150px',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
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

    const { storage: { fontSize, opacity }, storageDispatch } = useContext(StorageContext)
    const { showApp } = useContext(ShowAppContext)
    const [showModal, setShowModal] = useState<boolean>(false)

    const classes = useStyles()


    const FontValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeFontSize', fontSize: newValue as number })
    }

    const OpacityValueOnChange = (event: any, newValue: number | number[]) => {
        storageDispatch({ type: 'changeOpacity', opacity: newValue as number })
    }

    useEffect(() => { if (!showApp) setShowModal(false) }, [showApp])

    return (
        <Paper {...props} className={`${classes.control} ${props.className || ''}`} elevation={3}>
            <MovableTrigger >
                <IconButton aria-label='move' >
                    <PanTool />
                </IconButton>
            </MovableTrigger>
            <IconButton aria-label='more' onClick={() => setShowModal(true)}>
                <More />
            </IconButton>
            <Modal
                onClose={() => setShowModal(false)}
                open={showApp && showModal}>
                <Paper className={classes.settings}>
                    <Typography gutterBottom color='textPrimary' variant='h5'>Font Size</Typography>
                    <Slider
                        min={5}
                        max={50}
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
