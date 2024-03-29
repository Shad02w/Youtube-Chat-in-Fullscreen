import React, { useEffect, useRef, useMemo, useState, useLayoutEffect } from 'react'
import { useChatListItemStyle } from '@/styles/ChatListItem.style'
import { LiveChatTextMessage } from '@components/LiveChatTextMessage'
import { LiveChatPaidMessage } from '@components/LiveChatPaidMessage'
import { LiveChatMembershipItem } from '@components/LiveChatMembershipItem'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { ButtonBase, Box } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
// eslint-disable-next-line import/no-relative-parent-imports -- no
import down from '../assets/images/down.svg'
import { AdvancedChatLiveActions } from '@models/Chat'
import { useFullscreenState } from '@hooks/useFullscreenState'
import { useScrollBarStyle } from '@/styles/Scrollbar.style'
import { ChatFilter, shouldBeFiltered } from '@models/ChatFilter'
import { LiveChatPaidStickerRenderer } from './LiveChatPaidStickerRenderer'

interface IChatListProps extends React.HTMLAttributes<HTMLDivElement> {
    chatActions: AdvancedChatLiveActions
    fontSize: number
    opacitySC: number
    chatFilter: ChatFilter
    separateLine?: boolean
    onAutoScrollStart?(): void
    onAutoScrollStop?(): void
}

interface StyleProps {
    fontSize: number
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
            height: 'inherit',
            maxHeight: 'inherit',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            fontSize: (props: StyleProps) => `${props.fontSize}px`
        },
        hideScrollbar: {
            '&::-webkit-scrollbar-thumb': {
                background: 'transparent'
            }
        },
        downButtonContainer: {
            position: 'absolute',
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            transition: 'all 150ms ease-in-out'
        },
        show: {
            bottom: 30
        },
        hide: {
            bottom: -40
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

export const ChatList: React.FC<IChatListProps> = ({
    chatActions,
    opacitySC,
    fontSize,
    onAutoScrollStop,
    onAutoScrollStart,
    className,
    chatFilter,
    separateLine
}) => {
    const [autoScroll, setAutoScroll] = useState<boolean>(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const autoScrollRef = useRef<boolean>(autoScroll)
    autoScrollRef.current = autoScroll

    const { isFullscreen } = useFullscreenState()

    const classes = useStyles({ fontSize, autoScroll })
    const scrollBarStyles = useScrollBarStyle()
    const liveChatTextMessageClasses = useChatListItemStyle({ opacitySC, separateLine })

    useLayoutEffect(() => {
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
                .filter(action => shouldBeFiltered(action, chatFilter))
                .map(action => {
                    const { liveChatMembershipItemRenderer, liveChatTextMessageRenderer, liveChatPaidMessageRenderer, liveChatPaidStickerRenderer } =
                        action.addChatItemAction!.item
                    if (liveChatTextMessageRenderer)
                        return <LiveChatTextMessage key={action.uuid} renderer={liveChatTextMessageRenderer} classes={liveChatTextMessageClasses} />
                    else if (liveChatPaidMessageRenderer)
                        return <LiveChatPaidMessage key={action.uuid} renderer={liveChatPaidMessageRenderer} classes={liveChatTextMessageClasses} />
                    else if (liveChatMembershipItemRenderer)
                        return (
                            <LiveChatMembershipItem
                                key={action.uuid}
                                renderer={liveChatMembershipItemRenderer}
                                classes={liveChatTextMessageClasses}
                            />
                        )
                    else if (liveChatPaidStickerRenderer)
                        return (
                            <LiveChatPaidStickerRenderer
                                key={action.uuid}
                                renderer={liveChatPaidStickerRenderer}
                                classes={liveChatTextMessageClasses}
                            />
                        )
                    else return <React.Fragment key={action.uuid} />
                })
        } catch (error) {
            console.error(error)
        }
        return (
            <>
                <div style={{ paddingTop: 10 }} ref={listRef}>
                    {list}
                </div>
            </>
        )
    }

    const ChatListMemo = useMemo(createChatList, [chatActions, chatFilter])

    const onWheelListener = (event: React.WheelEvent<HTMLDivElement>) => {
        setAutoScroll(false)
    }

    return (
        <Box maxHeight={'100%'} overflow="hidden" position="relative" pt={1.5} pl={1} pr={1} pb={0.3}>
            <div
                onWheel={onWheelListener}
                ref={containerRef}
                className={`${className || ''} ${classes.container} ${scrollBarStyles.scrollbar} ${autoScroll ? classes.hideScrollbar : ''}`}
            >
                {ChatListMemo}
            </div>
            <div className={`${classes.downButtonContainer} ${autoScroll ? classes.hide : classes.show}`}>
                <CircleButtonBase focusRipple onClick={() => setAutoScroll(true)}>
                    <img className={classes.downButton} src={down} alt="resume autoscroll" />
                </CircleButtonBase>
            </div>
        </Box>
    )
}
