import { Select as MUISelect } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

export const Select = withStyles({
    root: {
        fontSize: '2rem',
        lineHeight: '2rem'
    }
})(MUISelect)
