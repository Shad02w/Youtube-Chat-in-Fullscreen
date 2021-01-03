import { withStyles } from '@material-ui/core/styles'
import { Select } from '@material-ui/core'

export const MySelect = withStyles({
    root: {
        fontSize: '2rem',
        lineHeight: '2rem'
    },
})(Select)