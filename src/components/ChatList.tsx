import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useLiveChatMessageStyle } from '../styles/ChatList.style'
import { LiveChatTextMessage } from './LiveChatTextMessage'
import { LiveChatPaidMessage } from './LiveChatPaidMessage'
import { LiveChatMembershipItem } from './LiveChatMembershipItem'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { isScrollUpDetectorCreator } from '../models/Scroll'
import { ButtonBase } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import down from '../assets/images/down.svg'
import { AdvancedChatLiveActions } from '../models/Chat'

interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> {
    chatActions: AdvancedChatLiveActions,
    fontSize: number
}


interface StyleProps {
    fontSize: number
}

const SvgIconButton = withStyles({
    root: {
        borderRadius: '50%'
    }
})(ButtonBase)
export const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            width: 'auto',
            height: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            // padding: '20px 10px',
            fontSize: (props: StyleProps) => `${props.fontSize}px`,
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
    el.scrollTop = el.scrollHeight - el.clientHeight
}


const isScrollUpDetector = isScrollUpDetectorCreator(5)

export const ChatList: React.FC<IChatListProps> = ({ chatActions, fontSize, className }) => {

    // const { chatActions } = useContext(AppContext)
    // const { storage: { fontSize } } = useContext(StorageContext)

    const classes = useStyles({ fontSize })
    const liveChatTextMessageClasses = useLiveChatMessageStyle()

    const [autoScroll, setAutoScroll] = useState<boolean>(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const autoScrollRef = useRef<boolean>(autoScroll)
    autoScrollRef.current = autoScroll


    // TODO: Auto scroll, when user scroll up, it stop, when back to buttom, it continous
    useEffect(() => {
        if (!containerRef.current || !listRef.current) return
        const listObserver = new MutationObserver(() => {
            const el = containerRef.current!
            requestAnimationFrame(() => (autoScrollRef.current) && (ScrollToBottom(el)))
        })
        listObserver.observe(listRef.current, { childList: true })
        return () => listObserver.disconnect()

    }, [containerRef])

    useEffect(() => {
        if (autoScroll && containerRef.current) ScrollToBottom(containerRef.current)
    }, [autoScroll])


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
                <div ref={listRef}>
                    {list}
                </div>
            </>
        )
    }

    const ChatListMemo = useMemo(createChatList, [chatActions])


    const ScrollListener = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const container = event.currentTarget!
        const { clientHeight, scrollTop, scrollHeight } = container
        requestAnimationFrame(() => {
            if (!autoScroll) return
            const isUp = isScrollUpDetector(scrollTop, clientHeight, scrollHeight)
            setAutoScroll(!isUp)
        })
    }

    return (
        <div
            onScroll={ScrollListener}
            ref={containerRef}
            className={`${className || ''} ${classes.container}`}
        >
            {ChatListMemo}
            <div className={`${classes.downButtonContainer} ${autoScroll ? classes.hide : classes.show}`} >
                <SvgIconButton
                    focusRipple
                    onClick={() => setAutoScroll(true)}
                >
                    <img
                        className={classes.downButton}
                        src={down}
                        alt="resume autoscroll"
                    />
                </SvgIconButton>
            </div>
        </div>
    )
}



