import axios from 'axios'
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { render } from 'react-dom'
import { CatchedLiveChatRequestMessage } from './background'
import { v4 as uuidV4 } from 'uuid'
import down from './assets/images/down.svg'

import './css/App.css'

/* Replay the get_live_chat xhr request to get the response */


interface MyWindow extends Window {
    injectHasRun: boolean
    requestIdleCallback(callback: any, options?: any): number
    cancelIdleCallback(handle: number): void
}
declare var window: MyWindow

interface ChatAction extends YoutubeLiveChat.LiveChatContinuationAction {
    uuid: string
}

type ChatActionList = ChatAction[]

interface Response { [key: string]: any }


type ScrollDirection = 'UP' | 'DOWN'

(async function () {


    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab

    if (window.injectHasRun === true)
        return
    window.injectHasRun = true

    // Dynamic import '@material-ui' to solve the issue of initilize multiple instance
    const { makeStyles, createStyles } = await import('@material-ui/core/styles')


    // run code here
    const chatListContainerId = '_youtube-chat-in-fullscreen-app'
    console.log('liveChatRequestReplay.js injected')

    // The request either be get or post
    // The type of return response can change overtime
    async function ReplayRequest(url: string, requestBody?: JSON): Promise<Response | undefined> {
        let data: Response | undefined
        try {
            if (!requestBody) {
                const res = await axios.get(url)
                data = res.data as Response
                // console.log('GET', data)
            } else {
                const res = await axios.post(url, requestBody, { responseType: 'json' })
                data = res.data as Response
                console.log('POST', data)
            }
        } catch (error) {
            if (error.response)
                console.error(error.response.data)
            else
                console.error(error)
        }
        return data
    }

    function createScrollDirectionDetector() {
        let lastscrollTop = 0;
        return function (currentScrollTop: number): ScrollDirection {
            const tmp = lastscrollTop
            lastscrollTop = currentScrollTop
            if (currentScrollTop < tmp) return 'UP'
            else return 'DOWN'
        }
    }


    function FindObjectByKeyRecursively(obj: Response, targetKey: string): any | undefined {
        const result = Object.keys(obj).find(k => k === targetKey)
        if (result)
            return obj[result]
        else if (typeof obj === 'object')
            for (const k of Object.keys(obj)) {
                const result = FindObjectByKeyRecursively(obj[k], targetKey)
                if (result !== undefined) return result
            }
        return undefined
    }


    const useStyles = makeStyles(() => createStyles({
        container: {
            width: 400,
            maxHeight: 600,
            overflowY: 'auto',
            'scrollbar-width': 'thin',
            'scrollbar-color': 'rgba(240, 240, 240, 0.3) transparent',
            '&::-webkit-scrollbar': {
                width: '5px'
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
            padding: 20
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
            transition: 'all 300ms ease-in-out',
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


    const App: React.FC = () => {

        // const [chatList, setChatList] = useState<YoutubeLiveChat.LiveChatContinuationAction[]>([])
        const chatActionList = useChatList([])
        const [isFullscreen, setIsFullScreen] = useState<boolean>(document.fullscreen)
        const [isLivePage, setIsLivePage] = useState<boolean>(false)
        const [autoScroll, setAutoScroll] = useState<boolean>(true)
        const containerRef = useRef<HTMLDivElement>(null)


        async function MessageListener(message: CatchedLiveChatRequestMessage) {
            // if url is /watch?*, that mean the tab enter a new page, so need to reset the isLivePage hook
            if (message.greeting) {
                setIsLivePage(false)
                setIsFullScreen(false)
                chatActionList.reset()
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
                        // if (action.addChatItemAction === undefined) console.log('not addChatItemAction', action)
                        if (action.addChatItemAction === undefined) return false
                        if (action.addChatItemAction.item === undefined) return false
                        if (action.addChatItemAction.item.liveChatTextMessageRenderer === undefined) return false
                        return true
                    })

                // Gradually update the chat list
                const timeout = FindObjectByKeyRecursively(data as Response, 'timeoutMs') as number
                const tti = timeout || 5000
                const timeInterval = tti / filteredActions.length
                console.log('Filtered Actions', filteredActions)
                filteredActions.forEach((action, i) => setTimeout(() => chatActionList.update([action]), i * timeInterval))
                setIsLivePage(true)
            }
        }

        function FullscreenListener(event: Event) {
            setIsFullScreen(document.fullscreen)
        }


        const scrollDetector = createScrollDirectionDetector()

        function ContainerOnScrollListener({ currentTarget: { scrollTop } }: React.UIEvent<HTMLDivElement, UIEvent>) {
            const scrollDirection = scrollDetector(scrollTop)
            switch (scrollDirection) {
                case 'UP':
                    setAutoScroll(false)
                    break;
                default:
                    break;
            }
        }

        useEffect(() => {
            if (!containerRef.current) return
            if (autoScroll)
                containerRef.current.scrollTop = containerRef.current.scrollHeight
        }, [chatActionList])

        useEffect(() => {
            console.log('autoscroll changed', autoScroll)
        }, [autoScroll])



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




        const updateChatList = () => {
            if (chatActionList.list.length === 0)
                return <></>
            else {
                return chatActionList.list
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
        }

        const backToAutoScroll = () => setAutoScroll(true)


        const classes = useStyles()

        return (
            <div
                ref={containerRef}
                className={`${classes.container} ${(chatActionList.list.length !== 0 && isFullscreen && isLivePage) ? classes.show : classes.hidden}`}
                onScroll={ContainerOnScrollListener}>
                <img
                    onClick={backToAutoScroll}
                    className={classes.downButton + ' ' + (autoScroll ? '' : classes.downButtonShow)} src={down} alt='Auto scroll icon' />
                <div className={classes.chatListContainer}>
                    {updateChatList()}
                </div>
            </div>
        )
    }


    requestAnimationFrame(createChatListContainer)

    function createChatListContainer() {
        const playerContainer = document.getElementById('player-container')
        if (!playerContainer) {
            // cancel_id = window.requestIdleCallback(createChatListContainer)
            requestAnimationFrame(createChatListContainer)
        } else {
            console.log('have container')
            // window.cancelIdleCallback(cancel_id)
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)
            render(<App />, document.getElementById(chatListContainerId))
        }
    }

})()
