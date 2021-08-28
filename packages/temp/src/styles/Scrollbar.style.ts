import { makeStyles } from '@material-ui/core/styles'

export const useScrollBarStyle = makeStyles({
    scrollbar: {
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(240, 240, 240, 0.3)',
            borderRadius: '10px',
        },
    },
})
