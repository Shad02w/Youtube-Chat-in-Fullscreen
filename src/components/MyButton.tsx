import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { ThemeColor } from '../models/Color'

export const MyButton = withStyles({
    containedPrimary: {
        backgroundColor: `#${ThemeColor[200]}`,
        borderWidth: '2px',
        '&:hover': {
            backgroundColor: `#${ThemeColor[100]}`,
            borderWidth: '2px',
        }
    },
    outlinedPrimary: {
        color: `#${ThemeColor[200]}`,
        borderColor: `#${ThemeColor[200]}`,
        borderWidth: '2px',
        '&:hover': {
            color: `#${ThemeColor[100]}`,
            borderColor: `#${ThemeColor[100]}`,
            borderWidth: '2px',
        }
    }
})(Button)


