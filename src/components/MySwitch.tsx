import {withStyles} from '@material-ui/core/styles'
import {Switch} from '@material-ui/core'
import {ThemeColor} from "../models/Color";

export const MySwitch = withStyles({
    switchBase: {
        color: `#${ThemeColor[100]}`,
        '&$checked': {
            color: `#${ThemeColor[200]}`,
        },
        '&$checked + $track': {
            backgroundColor: `#${ThemeColor[200]}`,
        },
    },
    checked: {},
    track: {},
})(Switch)

