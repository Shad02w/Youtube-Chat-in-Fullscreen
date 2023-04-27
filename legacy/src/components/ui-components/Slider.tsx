import { Slider as MUISlider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { ThemeColor } from '../../models/Color'

export const Slider = withStyles({
    root: {
        height: 8,
        color: `#${ThemeColor[100]}`
    },
    thumb: {
        width: 24,
        height: 24,
        marginTop: -(24 / 2 - 3),
        marginLeft: -12,
        backgroundColor: `#${ThemeColor[300]}`,
        '&:focus, &:hover, &:active': {
            boxShadow: '0px 0px 0px 8px rgba(199,44,65, 0.16)'
        }
    },
    track: {
        height: 6,
        borderRadius: 3,
        backgroundColor: `#${ThemeColor[100]}`
    },
    rail: {
        height: 6,
        borderRadius: 3,
        backgroundColor: `#${ThemeColor[100]}`
    },
    valueLabel: {
        fontSize: 14,
        left: `calc(-50% + 8px)`
    }
})(MUISlider)
