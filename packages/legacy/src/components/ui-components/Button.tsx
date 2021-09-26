import MUIButton from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { ThemeColor } from '../../models/Color'

export const Button = withStyles({
    containedPrimary: {
        backgroundColor: `#${ThemeColor[200]}`,
        borderWidth: '2px',
        '&:hover': {
            backgroundColor: `#${ThemeColor[100]}`,
            borderWidth: '2px'
        }
    },
    textSizeLarge: {
        fontSize: '1.4rem'
    },
    containedSizeLarge: {
        fontSize: '1.4rem'
    },
    outlinedSizeLarge: {
        fontSize: '1.4rem'
    },
    outlinedPrimary: {
        color: `#${ThemeColor[200]}`,
        borderColor: `#${ThemeColor[200]}`,
        borderWidth: '2px',
        '&:hover': {
            color: `#${ThemeColor[100]}`,
            borderColor: `#${ThemeColor[100]}`,
            borderWidth: '2px'
        }
    }
})(MUIButton)
