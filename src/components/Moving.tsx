import { colors } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Opacity } from '@material-ui/icons'
import React, { useContext } from 'react'
import { StorageContext } from '../contexts/StorageContext'
interface IMoving {
    className?: string
}

interface StyleProps {
    fontSize: number
}

const useStyles = makeStyles(theme => createStyles(
    {
        container: {
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 30,
            fontWeight: 1000,
            opacity: 0.4
        }
    }
))


export const Moving: React.FC<IMoving> = ({ className }) => {
    const { storage: { fontSize } } = useContext(StorageContext)
    const classes = useStyles({ fontSize })
    return (
        <div className={`${className} ${classes.container}`}>
            Moving
        </div>
    )
}

