import { makeStyles } from '@material-ui/core/styles'

export type LiveChatMessageStyleType = ReturnType<typeof useLiveChatMessageStyle>

export const useLiveChatMessageStyle = makeStyles({
    textMessage: {
        padding: '5px 10px',
        display: 'grid',
        gridTemplateColumns: '1.5em 1fr',
        gridGap: '1.25em'
    },
    card: {
        borderRadius: 4,
        overflow: 'hidden',
        margin: '10px 0px'
    },
    cardHeader: {
        display: 'grid',
        gridTemplateColumns: '3.5em 1fr',
        padding: '0.8em 0.8em',
        gridGap: '0.6em'
    },
    cardHeaderAuthorName: {
        fontSize: '1em',
        marginBottom: '0.23em'
    },
    cardHeaderHighlight: {
        fontSize: '1.05em',
    },
    cardHeaderImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardHeaderImage: {
        width: '3em !important',
    },
    cardMessage: {
        padding: '0.8em 0.8em',
    },
    bold: {
        fontWeight: 600
    },
    authorImage: {
        borderRadius: '50%',
        width: '1.6em',
    },
    authorName: {
        fontWeight: 800,
        display: 'inline-block',
        wordBreak: 'break-all',
        marginRight: '0.6em'
    },
    isMember: {
        color: 'green'
    },
    authorBadge: {
        width: '1.3em',
        marginRight: 5,
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    emoji: {
        // width: props => theme.spacing(props.fontSize + 1.75),
        width: '1.8em',
        marginRight: 5,
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    message: {
        wordBreak: 'break-word'
    },
})
