import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'

export const MyMenuItem = withStyles({
    root: {
        fontSize: '1.5rem'
    }
})(MenuItem)