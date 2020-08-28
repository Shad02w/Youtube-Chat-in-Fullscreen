import React, { useState, useEffect, useRef } from 'react'

import { CatchedLiveChatRequestMessage } from './background'
import { v4 as uuidV4 } from 'uuid'
import down from './assets/images/down.svg'
import { ReplayRequest, createScrollDirectionDetector, FindObjectByKeyRecursively } from './function'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import './css/App.css'


interface ChatAction extends YoutubeLiveChat.LiveChatContinuationAction {
    uuid: string
    pageUUid: string
}

type ChatActionList = ChatAction[]

const minHeight = 200,
    minWidth = 400,
    fixedHeight = 600,
    fixedWidth = 400

const useStyles = makeStyles(() => createStyles({
    wrapper: {
        width: fixedWidth,
        position: 'absolute',
        top: 100,
        left: 100,
        overflow: 'hidden',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"chat"',
        borderRadius: 10,
        resize: 'both'
    },
    hidden: {
        minHeight: 0,
        height: 0,
    },
    show: {
        display: 'grid',
        padding: 10,
        minHeight,
        minWidth,
        height: fixedHeight,
    },
    container: {
        gridArea: 'chat',
        width: 'auto',
        height: 'auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        'scrollbar-width': 'thin',
        'scrollbar-color': 'rgba(240, 240, 240, 0.3) transparent',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(240, 240, 240, 0.3)',
            borderRadius: '10px'
        }
    },
    chatListContainer: {
        padding: 10,
        maxHeight: '100%'
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
    },
}))


const useMovableStyles = makeStyles(() => createStyles({
    control: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // padding: 10,
    },
    moveButton: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'pink',
        '&:hover': {
            cursor: 'pointer'
        }
    },
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

    //Chat List
    const chatActions = useChatList([])
    const [isFullscreen, setIsFullScreen] = useState<boolean>(document.fullscreen)
    const [isLivePage, setIsLivePage] = useState<boolean>(false)
    // const [autoScroll, setAutoScroll] = useState<boolean>(true)
    const [pageUuid, setPageUuid] = useState<string>(uuidV4())
    const containerRef = useRef<HTMLDivElement>(null)
    const pageUuidRef = useRef(pageUuid)
    pageUuidRef.current = pageUuid


    const classes = useStyles()

    async function MessageListener(message: CatchedLiveChatRequestMessage) {
        // if url is /watch?*, that mean the tab enter a new page, so need to reset the isLivePage hook
        if (message.greeting) {
            setPageUuid(uuidV4())
            return
        } else {
            console.log(pageUuidRef.current)
            const { url } = message.details
            const requestBody = message.requestBody
            const data = await ReplayRequest(url, requestBody)
            if (!data) return
            const actions = FindObjectByKeyRecursively(data as Response, 'actions') as YoutubeLiveChat.LiveChatContinuationAction[]
            if (!actions) return
            // add uuid to each action
            const actionsWithUuid = actions.map((action) => ({ ...action, uuid: uuidV4(), pageUUid: pageUuidRef.current })) as ChatActionList
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
            filteredActions.forEach((action, i) => setTimeout(() => {
                // check whether the chat action is come from previous page
                if (action.pageUUid === pageUuidRef.current)
                    chatActions.update([action])
            }, i * timeInterval))

            setIsLivePage(true)
        }
    }




    function FullscreenListener(event: Event) {
        setIsFullScreen(document.fullscreen)

    }

    // const ResumeAutonScroll = () => setAutoScroll(true)

    // function ContainerOnScrollListener({ currentTarget: { scrollTop, scrollHeight, clientHeight } }: React.UIEvent<HTMLDivElement, UIEvent>) {
    //     const scrollDirection = scrollDirectionDetector(scrollTop, scrollHeight, clientHeight)
    //     if (scrollDirection === 'UP') setAutoScroll(false)
    // }

    // useEffect(() => {
    //     console.log(chatActions)
    //     if (!containerRef.current) return
    //     const el = containerRef.current
    //     if (autoScroll)
    //         el.scrollTop = el.scrollHeight
    // }, [chatActions])

    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        el.scrollTop = el.scrollHeight
    }, [chatActions])


    useEffect(() => {
        setIsLivePage(false)
        setIsFullScreen(document.fullscreen)
        // setAutoScroll(true)
        chatActions.reset()
    }, [pageUuid])


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

    /**
     * Movable
     * @param event 
     */

    interface Distance { x: number, y: number }

    const [isMoving, setIsMoving] = useState<boolean>(false)
    const [initialDistance, setInitialDistance] = useState<Distance>({ x: 0, y: 0 })
    const wrapperRef = useRef<HTMLDivElement>(null)
    const isMovingRef = useRef<boolean>(isMoving)
    const initialDistanceRef = useRef<Distance>(initialDistance)
    isMovingRef.current = isMoving
    initialDistanceRef.current = initialDistance



    const movaleClasses = useMovableStyles()

    const onMouseMovingListener = ({ pageX: mouseX, pageY: mouseY }: MouseEvent) => {
        if (!isMovingRef.current || !wrapperRef.current) return
        const container = wrapperRef.current
        container.style.left = `${mouseX - initialDistanceRef.current.x}px`
        container.style.top = `${mouseY - initialDistanceRef.current.y}px`
        container.style.right = `auto`
        container.style.bottom = `auto`
    }

    const onMouseDownListener = ({ pageX: mouseX, pageY: mouseY }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!wrapperRef.current) return
        console.log('mousedown')
        const wrapper = wrapperRef.current
        setIsMoving(true)
        const rect = wrapper.getBoundingClientRect()
        setInitialDistance({ x: mouseX - rect.x, y: mouseY - rect.y })
    }

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMovingListener)
        return () => {
            document.removeEventListener('mousemove', onMouseMovingListener)
        }
    }, [wrapperRef])

    useEffect(() => {
        console.log('isMoving', isMoving)
        if (!isMoving) return
        document.addEventListener('mouseup', () => setIsMoving(false), { once: true })
    }, [isMoving])

    const Control = () => {

        return (
            <div className={movaleClasses.control}>
                <div className={movaleClasses.moveButton} onMouseDown={onMouseDownListener}></div>
            </div>
        )
    }


    return (
        <div
            ref={wrapperRef}
            className={`${classes.wrapper} ${(chatActions.list.length !== 0 && isFullscreen && isLivePage) ? classes.show : classes.hidden} ${isMoving ? 'noselect' : ''}`}>
            <div
                ref={containerRef}
                className={classes.container}
            // onScroll={ContainerOnScrollListener}
            >
                {/* <img
                onClick={ResumeAutonScroll}
                className={classes.downButton + ' ' + (autoScroll ? '' : classes.downButtonShow)} src={down} alt='Auto scroll icon' /> */}
                {ChatList()}
            </div>
            {Control()}
        </div>
    )
}

