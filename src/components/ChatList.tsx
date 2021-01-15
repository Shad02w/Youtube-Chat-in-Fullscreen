import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useChatListItemStyle } from '../styles/ChatListItem.style'
import { LiveChatTextMessage } from './LiveChatTextMessage'
import { LiveChatPaidMessage } from './LiveChatPaidMessage'
import { LiveChatMembershipItem } from './LiveChatMembershipItem'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { ButtonBase } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import down from '../assets/images/down.svg'
import { AdvancedChatLiveActions } from '../models/Chat'
import { useFullscreenState } from './hooks/useFullscreenState';
import { useScrollBarStyle } from '@/styles/Scrollbar.style'

interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> {
    chatActions: AdvancedChatLiveActions,
    fontSize: number
    opacitySC: number
    onAutoScrollStart?(): void
    onAutoScrollStop?(): void
}


interface StyleProps {
    fontSize: number,
    autoScroll: boolean
}

const CircleButtonBase = withStyles({
    root: {
        borderRadius: '50%'
    }
})(ButtonBase)

export const useStyles = makeStyles(() =>
    createStyles({
        container: {
            width: 'auto',
            height: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            fontSize: (props: StyleProps) => `${props.fontSize}px`,
        },
        hideScrollbar: {
            '&::-webkit-scrollbar-thumb': {
                background: 'transparent',
            }
        },
        downButtonContainer: {
            position: 'absolute',
            bottom: 10,
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            transition: 'all 150ms ease-in-out'
        },
        show: {
            bottom: 30,
        },
        hide: {
            bottom: -40,
        },
        downButton: {
            width: 30,
            height: 30
        }
    })
)


const ScrollToBottom = (el: HTMLElement) => {
    el.scrollTop = el.scrollHeight
}



export const ChatList: React.FC<IChatListProps> = ({ chatActions, opacitySC, fontSize, onAutoScrollStop, onAutoScrollStart, className }) => {



    const [autoScroll, setAutoScroll] = useState<boolean>(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const autoScrollRef = useRef<boolean>(autoScroll)
    autoScrollRef.current = autoScroll

    const { isFullscreen } = useFullscreenState()

    const classes = useStyles({ fontSize, autoScroll })
    const scrollBarStyles = useScrollBarStyle()
    const liveChatTextMessageClasses = useChatListItemStyle({ opacitySC })

    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        requestAnimationFrame(() => {
            if (!autoScrollRef.current) return
            ScrollToBottom(el)
        })
    })

    // when re-enter the full screen
    useEffect(() => {
        if (!autoScroll || !containerRef.current || !isFullscreen) return
        requestAnimationFrame(() => ScrollToBottom(containerRef.current!))
    }, [autoScroll, isFullscreen])

    useEffect(() => {
        if (autoScroll && onAutoScrollStart) onAutoScrollStart()
        else if (!autoScroll && onAutoScrollStop) onAutoScrollStop()
    }, [autoScroll, onAutoScrollStart, onAutoScrollStop])


    const createChatList = () => {
        let list: JSX.Element | JSX.Element[] = <></>
        try {
            list = chatActions
                .map((action) => {
                    const { liveChatMembershipItemRenderer, liveChatTextMessageRenderer, liveChatPaidMessageRenderer } = action.addChatItemAction!.item
                    if (liveChatTextMessageRenderer)
                        return <LiveChatTextMessage key={action.uuid}
                            renderer={liveChatTextMessageRenderer}
                            classes={liveChatTextMessageClasses} />
                    else if (liveChatPaidMessageRenderer)
                        return <LiveChatPaidMessage key={action.uuid}
                            renderer={liveChatPaidMessageRenderer}
                            classes={liveChatTextMessageClasses} />
                    else if (liveChatMembershipItemRenderer)
                        return <LiveChatMembershipItem key={action.uuid}
                            renderer={liveChatMembershipItemRenderer}
                            classes={liveChatTextMessageClasses} />
                    else
                        return <React.Fragment key={action.uuid} />
                })
        } catch (error) {
            console.error(error)
        }
        return (
            <>
                <div
                    style={{ paddingTop: 50 }}
                    ref={listRef}>
                    {list}
                </div>
            </>
        )
    }

    const ChatListMemo = useMemo(createChatList, [chatActions])

    const onWheelListener = (event: React.WheelEvent<HTMLDivElement>) => {
        setAutoScroll(false)
    }

    return (
        <div
            onWheel={onWheelListener}
            ref={containerRef}
            className={`${className || ''} ${classes.container} ${scrollBarStyles.scrollbar} ${autoScroll ? classes.hideScrollbar : ''}`}
        >
            {ChatListMemo}
            <div className={`${classes.downButtonContainer} ${autoScroll ? classes.hide : classes.show}`} >
                <CircleButtonBase
                    focusRipple
                    onClick={() => setAutoScroll(true)}
                >
                    <img
                        className={classes.downButton}
                        src={down}
                        alt="resume autoscroll"
                    />
                </CircleButtonBase>
            </div>
        </div>
    )
}



