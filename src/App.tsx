import React, { useState, useEffect, useRef } from 'react'

import { CatchedLiveChatRequestMessage } from './background'
import { v4 as uuidV4 } from 'uuid'
import down from './assets/images/down.svg'
import { ReplayRequest, createScrollDirectionDetector, FindObjectByKeyRecursively } from './function'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import './css/App.css'


interface ChatAction extends YoutubeLiveChat.LiveChatContinuationAction {
    uuid: string
}

type ChatActionList = ChatAction[]


const useStyles = makeStyles(() => createStyles({
    container: {
        width: 400,
        maxHeight: 600,
        overflowY: 'auto',
        overflowX: 'hidden',
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(240, 240, 240, 0.3) transparent',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(240, 240, 240, 0.3)',
            borderRadius: '10px'
        }
    },
    chatListContainer: {
        padding: 10
    },
    hidden: {
        height: 0,
    },
    show: {
        height: 500,
    },
    chatItem: {
        padding: '5px 10px',
        fontSize: 14,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center'
    },
    authorImage: {
        borderRadius: '50%',
        height: 25,
        width: 25,
        marginRight: 20
    },
    authorName: {
        marginRight: 10,
        fontWeight: 700,
        display: 'flex',
        flexFlow: 'row nowrap',
        minWidth: 'min-conent',
    },
    isMember: {
        color: 'green'
    },
    authorBadge: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    chatMessage: {
        overflowWrap: 'break-word',
        wordWrap: 'break-word'
    },
    downButton: {
        position: 'absolute',
        bottom: -50,
        margin: '0 auto',
        width: 30,
        height: 30,
        left: 0,
        right: 0,
        transition: 'all 150ms ease-in-out',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    downButtonShow: {
        bottom: 30,
    }
}))


const useChatList = (initValue: ChatActionList) => {
    const [chatActionList, setChatActionList] = useState<ChatActionList>(initValue)
    const update = (action: ChatActionList) => setChatActionList(preState => preState.concat(action).slice(-100))
    const reset = () => setChatActionList([])
    return {
        list: chatActionList,
        update,
        reset
    }
}

const scrollDirectionDetector = createScrollDirectionDetector()

export const App: React.FC = () => {

    const chatActions = useChatList([])
    const [isFullscreen, setIsFullScreen] = useState<boolean>(document.fullscreen)
    const [isLivePage, setIsLivePage] = useState<boolean>(false)
    const [autoScroll, setAutoScroll] = useState<boolean>(true)
    const containerRef = useRef<HTMLDivElement>(null)


    async function MessageListener(message: CatchedLiveChatRequestMessage) {
        // if url is /watch?*, that mean the tab enter a new page, so need to reset the isLivePage hook
        if (message.greeting) {
            setIsLivePage(false)
            setIsFullScreen(document.fullscreen)
            setAutoScroll(true)
            chatActions.reset()
            return
        } else {
            const { url } = message.details
            const requestBody = message.requestBody
            const data = await ReplayRequest(url, requestBody)
            if (!data) return
            const actions = FindObjectByKeyRecursively(data as Response, 'actions') as YoutubeLiveChat.LiveChatContinuationAction[]
            if (!actions) return
            // add uuid to each action
            const actionsWithUuid = actions.map((action) => ({ ...action, uuid: uuidV4() })) as ChatActionList
            // Do data false check before upate the hook
            const filteredActions = actionsWithUuid
                .filter(action => {
                    if (action.addChatItemAction === undefined) return false
                    if (action.addChatItemAction.item === undefined) return false
                    if (action.addChatItemAction.item.liveChatTextMessageRenderer === undefined) return false
                    return true
                })

            // Gradually update the chat list
            const timeout = FindObjectByKeyRecursively(data as Response, 'timeoutMs') as number
            const tti = timeout || 5000
            const timeInterval = tti / filteredActions.length
            // console.log('Filtered Actions', filteredActions)
            filteredActions.forEach((action, i) => setTimeout(() => chatActions.update([action]), i * timeInterval))
            setIsLivePage(true)
        }
    }

    function FullscreenListener(event: Event) {
        setIsFullScreen(document.fullscreen)
    }



    const ResumeAutonScroll = () => setAutoScroll(true)



    function ContainerOnScrollListener({ currentTarget: { scrollTop, scrollHeight, clientHeight } }: React.UIEvent<HTMLDivElement, UIEvent>) {
        const scrollDirection = scrollDirectionDetector(scrollTop, scrollHeight, clientHeight)
        console.log(scrollDirection)
        switch (scrollDirection) {
            case 'UP':
                setAutoScroll(false)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        console.log(chatActions)
        if (!containerRef.current) return
        const el = containerRef.current
        if (autoScroll)
            el.scrollTop = el.scrollHeight
    }, [chatActions])




    useEffect(() => {
        document.addEventListener('fullscreenchange', FullscreenListener)
        chrome.runtime.onMessage.addListener(MessageListener)
        return () => {
            document.removeEventListener('fullscreenchange', FullscreenListener)
            chrome.runtime.onMessage.removeListener(MessageListener)
        }
    }, [])



    const createBagde = (authorBadges: YoutubeLiveChat.LiveChatTextMessageRenderer.AuthorBadge[] | undefined) => {
        try {
            if (!authorBadges || authorBadges.length === 0) return <></>
            else if (!authorBadges[0].liveChatAuthorBadgeRenderer.customThumbnail) return <></>
            else {
                return authorBadges.map((badge, key) =>
                    <img key={key} className={classes.authorBadge} src={badge.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails[0].url} alt="" />
                )
            }
        } catch (error) {
            console.error(error)
            return <></>
        }
    }

    const ChatList = () => {
        let list;
        if (chatActions.list.length === 0)
            list = <></>
        else {
            list = chatActions.list
                .map((action) => {
                    return (
                        <div className={classes.chatItem} key={action.uuid}>
                            <img className={classes.authorImage} src={action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorPhoto.thumbnails[0].url} alt="author Image" />
                            <div className={classes.authorName + ' ' +
                                (action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorBadges === undefined ? '' : classes.isMember)}>{action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorName.simpleText}</div>
                            {createBagde(action.addChatItemAction!.item.liveChatTextMessageRenderer!.authorBadges)}
                            <div className={classes.chatMessage}>{action.addChatItemAction!.item.liveChatTextMessageRenderer!.message.runs[0].text}</div>
                        </div>
                    )
                })
        }
        return (
            <div className={classes.chatListContainer}>
                {list}
            </div>
        )
    }

    const classes = useStyles()


    return (
        <div
            ref={containerRef}
            className={`${classes.container} ${(chatActions.list.length !== 0 && isFullscreen && isLivePage) ? classes.show : classes.hidden}`}
            onScroll={ContainerOnScrollListener}
        >
            <img
                onClick={ResumeAutonScroll}
                className={classes.downButton + ' ' + (autoScroll ? '' : classes.downButtonShow)} src={down} alt='Auto scroll icon' />
            <ChatList></ChatList>
        </div>
    )
}

