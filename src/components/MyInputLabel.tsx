import { InputLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { ThemeColor } from '../models/Color'

export const MyInputLabel = withStyles({
    root: {
        fontSize: '1.4rem'
    },
    focused: {
        // color: `#${ThemeColor[100]} !important`
    }
})(InputLabel)
