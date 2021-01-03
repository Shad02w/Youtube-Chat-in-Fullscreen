import { withStyles } from '@material-ui/core/styles'
import { Select } from '@material-ui/core'
import { ThemeColor } from '../models/Color'

export const MySelect = withStyles({
    root: {
        fontSize: '2rem',
        lineHeight: '2rem'
    },
})(Select)