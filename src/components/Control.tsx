import React, { useState, useContext, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Done from '@material-ui/icons/Done'
import OpenWith from '@material-ui/icons/OpenWith'
import { MovableTrigger } from './Movable'
import { ShowAppContext } from '../App'

export interface IControlProps extends React.HTMLAttributes<HTMLDivElement> { }

const useStyles = makeStyles((theme) => createStyles({
    control: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    moveButton: {
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
        border: '0px',
        outline: 'none',
        position: 'absolute',
        width: 400,
        height: 'auto',
        padding: 50,
        top: '50%',
        left: '50%',
        marginLeft: '-150px',
        marginTop: '-150px',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 10
    },
    doneButton: {
        marginTop: theme.spacing(2),
        fontSize: '1.3rem',
    },
    container: {
        all: "initial",
        '*': {
            all: 'unset'
        }
    },
    margin: {
        margin: theme.spacing(1),
    },
}))

export const Control: React.FC<IControlProps> = (props) => {
    const classes = useStyles()
    const { showApp } = useContext(ShowAppContext)

    const [showModal, setShowModal] = useState<boolean>(false)
    const [fontValue, setFontValue] = useState<number>(16)
    const [opacityValue, setOpacityValue] = useState<number>(1)



    const FontValueOnChange = (event: any, newValue: number | number[]) => {
        setFontValue(newValue as number)
    }

    const OpacityValueOnChange = (event: any, newValue: number | number[]) => {
        setOpacityValue(newValue as number)
    }

    useEffect(() => { if (!showApp) setShowModal(false) }, [showApp])



    return (
        <div {...props} className={`${props.className || ''}`}>
            <MovableTrigger className={classes.moveButton}>
                <OpenWith fontSize='large' />
            </MovableTrigger>
            <div className={classes.moveButton} onClick={() => setShowModal(pre => !pre)}>S</div>
            <Modal
                onClose={() => setShowModal(false)}
                open={showApp && showModal}>
                <div className={classes.settings}>
                    <Typography gutterBottom color='textPrimary' variant='h5'>Font Size</Typography>
                    <Slider
                        min={5}
                        max={50}
                        value={fontValue}
                        defaultValue={fontValue}
                        valueLabelDisplay='auto'
                        onChange={FontValueOnChange} />
                    <Typography gutterBottom color='textPrimary' variant='h5'>Opacity</Typography>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacityValue}
                        valueLabelDisplay='auto'
                        defaultValue={opacityValue}
                        onChange={OpacityValueOnChange} />
                    <Button className={classes.doneButton}
                        startIcon={<Done />}
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={() => { setShowModal(false) }}>Done</Button>
                </div>
            </Modal>
        </div>
    )

}
