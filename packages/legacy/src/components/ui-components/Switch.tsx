import { withStyles } from '@material-ui/core/styles'
import MUISwitch from '@material-ui/core/Switch'
import { ThemeColor } from '../../models/Color'

export const Switch = withStyles({
    switchBase: {
        color: `#${ThemeColor[100]}`,
        '&$checked': {
            color: `#${ThemeColor[200]}`
        },
        '&$checked + $track': {
            backgroundColor: `#${ThemeColor[200]}`
        }
    },
    checked: {},
    track: {}
})(MUISwitch)
