import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { CatchedLiveChatRequestMessage } from './background'

import './css/App.css'

/* Replay the get_live_chat xhr request to get the response */


interface MyWindow extends Window {
    injectHasRun: boolean
    requestIdleCallback(callback: any, options?: any): number
    cancelIdleCallback(handle: number): void
}

interface Response { [key: string]: any }

declare var window: MyWindow



(async function () {

    // Since Youtube get new video page without reload, so the injected script is still there  when go to next video page
    // This prevent same  script run multiple time in one tab
    if (window.injectHasRun === true)
        return
    window.injectHasRun = true


    const { makeStyles, createStyles } = await import('@material-ui/core/styles')


    // run code here
    console.log('liveChatRequestReplay.js injected')
    const chatListContainerId = '_chat-list-container'

    // Dynamic import to make solve the issue of initilize multiple instance
    // import('@material-ui/core/styles').then((styles) => {

    // })


    // The request either be get or post

    // The type of return response change change overtime
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
                // console.log('POST', data)
            }
        } catch (error) {
            if (error.response)
                console.error(error.response.data)
            else
                console.error(error)
        }
        return data
    }




    const FindObjectByKeyRecursively = (obj: Response, targetKey: string): object | undefined => {
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
        innerContainer: {
            width: 300,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
        },
        hidden: {
            height: 0,
        },
        show: {
            height: 300,
        },
        chatItem: {
            padding: '5px 10px',
            fontSize: 14,
            display: 'flex',
            flexFlow: 'row nowrap',
        },
        authorImage: {
            borderRadius: '50%',
            height: 25,
            width: 25,
            marginRight: 20
        },
        authorName: {
            marginRight: 10,
            fontWeight: 500,
            display: 'flex',
            flexFlow: 'row nowrap'
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
    }))




    const App: React.FC = () => {

        const [chatListActions, setChatListActions] = useState<YoutubeLiveChat.LiveChatContinuationAction[]>([])
        const [isFullScreen, setIsFullScreen] = useState<boolean>(document.fullscreen)
        const [isLivePage, setIsLivePage] = useState<boolean>(false)

        async function MessageListener(message: CatchedLiveChatRequestMessage) {
            // if url is /watch?*, that mean the tab enter a new page, so need to 
            console.log(message)
            if (message.greeting) {
                setIsLivePage(false)
                return
            } else {
                const { url } = message.details
                const requestBody = message.requestBody
                const data = await ReplayRequest(url, requestBody)
                if (!data) return
                const actions = FindObjectByKeyRecursively(data as Response, 'actions') as YoutubeLiveChat.LiveChatContinuationAction[]
                if (!actions) return
                // Do data false check before upate the hool
                try {
                    const filteredActions = actions
                        .filter(action => {
                            // if (action.addChatItemAction === undefined) console.log('not addChatItemAction', action)
                            if (action.addChatItemAction === undefined) return false
                            if (action.addChatItemAction.item === undefined) return false
                            if (action.addChatItemAction.item.liveChatTextMessageRenderer === undefined) return false
                            return true
                        })
                    setChatListActions([...filteredActions])
                    setIsLivePage(true)
                } catch (error) {
                    console.error('action filter error', error)
                }
            }
        }

        function FullscreenListener(event: Event) {
            setIsFullScreen(document.fullscreen)
        }


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
                    console.log(authorBadges)
                    return authorBadges.map((badge, key) =>
                        <img key={key} className={classes.authorBadge} src={badge.liveChatAuthorBadgeRenderer.customThumbnail!.thumbnails[0].url} alt="" />
                    )
                }
            } catch (error) {
                console.error(error)
                return <></>
            }
        }


        const creteChatList = () => {
            if (chatListActions.length === 0)
                return <></>
            else {
                return chatListActions
                    .map((action, key) => {
                        return (
                            <div className={classes.chatItem} key={key}>
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

        const classes = useStyles()

        return (
            <div id='_chat-list-inner-container' className={`${classes.innerContainer} 
            ${(chatListActions.length !== 0 && isFullScreen && isLivePage) ? classes.show : classes.hidden}`}>
                {creteChatList()}
            </div>
        )
    }


    // Check constantly whether player-container is already created
    let cancel_id = window.requestIdleCallback(createChatListContainer)

    function createChatListContainer() {
        const playerContainer = document.getElementById('player-container')
        if (!playerContainer) {
            cancel_id = window.requestIdleCallback(createChatListContainer)
        } else {
            console.log('have container')
            window.cancelIdleCallback(cancel_id)
            const chatListContainer = document.createElement('div')
            chatListContainer.id = chatListContainerId
            playerContainer.append(chatListContainer)
            render(<App />, document.getElementById(chatListContainerId))
        }
    }





})()

