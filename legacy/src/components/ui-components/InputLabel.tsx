import { InputLabel as MUIInputLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

export const InputLabel = withStyles({
    root: {
        fontSize: '1.6rem'
    },
    focused: {
        // color: `#${ThemeColor[100]} !important`
    }
})(MUIInputLabel)
