import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { ThemeColor } from '../models/Color'

export const MyButton = withStyles({
    containedPrimary: {
        backgroundColor: `#${ThemeColor[200]}`,
        '&:hover': {
            backgroundColor: `#${ThemeColor[100]}`
        }
    }
})(Button)


