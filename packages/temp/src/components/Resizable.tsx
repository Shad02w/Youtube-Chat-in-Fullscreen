import React, { useRef } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Draggable } from './Draggable'
import { Position, Size } from '@models/Interact'

type PositionSet = {
    [key in keyof Position]?: boolean
}

export interface ResizeEndCallbackValue {
    size: Size
    position: { top: number; left: number }
}

export interface ResizeCallbackValue {
    size: Size
}

export interface ResizeStartCallbackValue {
    position: Partial<Position>
}

interface ResizableProps {
    size: Size
    position: Partial<Position>
    resizerSize?: number
    className?: string
    onResize?(value: ResizeCallbackValue): any
    onResizeStart?(value: ResizeStartCallbackValue): any
    onResizeEnd?(value: ResizeEndCallbackValue): any
}

interface StylesProps {
    size: Size
    position: Partial<Position>
    resizerSize?: number
}

const useStyles = makeStyles(() =>
    createStyles({
        resizable: {
            position: 'absolute',
            width: (props: StylesProps) => props.size.width,
            height: props => props.size.height,
            backgroundColor: 'transparent',
            padding: ({ resizerSize }) => (resizerSize ? resizerSize : 5),
        },
        resizerVertical: {
            position: 'absolute',
            height: '100%',
            width: ({ resizerSize }) => (resizerSize ? resizerSize : 5),
        },
        resizerHorizontal: {
            position: 'absolute',
            height: ({ resizerSize }) => (resizerSize ? resizerSize : 5),
            width: '100%',
        },
        resizerRight: {
            right: 0,
            bottom: 0,
            cursor: 'e-resize',
        },
        resizerLeft: {
            left: 0,
            bottom: 0,
            cursor: 'w-resize',
        },
        resizerBottom: {
            bottom: 0,
            left: 0,
            cursor: 's-resize',
        },
        resizerTop: {
            top: 0,
            left: 0,
            cursor: 'n-resize',
        },
        resizerBoth: {
            width: 20,
            height: 20,
            borderRadius: '50%',
            position: 'absolute',
        },
        resizerTopLeft: {
            top: -10,
            left: -10,
            cursor: 'nw-resize',
        },
        resizerTopRight: {
            top: -10,
            right: -10,
            cursor: 'ne-resize',
        },
        resizerBottomLeft: {
            bottom: -10,
            left: -10,
            cursor: 'sw-resize',
        },
        resizerBottomRight: {
            bottom: -10,
            right: -10,
            cursor: 'se-resize',
        },
    })
)

export const Resizable: React.FC<React.PropsWithChildren<ResizableProps>> = props => {
    const { resizerSize, children, className, onResizeEnd, onResizeStart, onResize, size, position } = props
    const resizableRef = useRef<HTMLDivElement | null>(null)
    const classes = useStyles({ size, position, resizerSize })

    const startSize = useRef(size)

    const getCSSPosition = () => {
        if (!resizableRef.current) return position
        const { top, bottom, left, right } = window.getComputedStyle(resizableRef.current)
        return {
            top: parseInt(top),
            bottom: parseInt(bottom),
            left: parseInt(left),
            right: parseInt(right),
        }
    }

    const handleDragStart = (set: PositionSet) => {
        startSize.current = size
        const { left, bottom, right, top } = getCSSPosition()
        onResizeStart &&
            onResizeStart({
                position: {
                    top: set.top ? top : undefined,
                    bottom: set.bottom ? bottom : undefined,
                    left: set.left ? left : undefined,
                    right: set.right ? right : undefined,
                },
            })
    }

    const handleDragEnd = () => {
        const { top, left } = getCSSPosition()
        if (top === undefined || left === undefined) return
        onResizeEnd && onResizeEnd({ size, position: { top, left } })
    }

    return (
        <div
            ref={resizableRef}
            style={{
                top: position.top ? position.top : undefined,
                bottom: position.bottom ? position.bottom : undefined,
                left: position.left ? position.left : undefined,
                right: position.right ? position.right : undefined,
            }}
            className={`${className ? className : ''} ${classes.resizable}`}
        >
            <Draggable
                className={`${classes.resizerHorizontal} ${classes.resizerTop}`}
                move={false}
                onDragStart={() => handleDragStart({ bottom: true, left: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                ...size,
                                height: startSize.current.height - (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerHorizontal} ${classes.resizerBottom}`}
                move={false}
                onDragStart={() => handleDragStart({ top: true, left: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                ...size,
                                height: startSize.current.height + (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerVertical} ${classes.resizerLeft}`}
                move={false}
                onDragStart={() => handleDragStart({ top: true, right: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                ...size,
                                width: startSize.current.width - (current.x - start.x),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerVertical} ${classes.resizerRight}`}
                move={false}
                onDragStart={() => handleDragStart({ top: true, left: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                ...size,
                                width: startSize.current.width + (current.x - start.x),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerBoth} ${classes.resizerTopLeft}`}
                move={false}
                onDragStart={() => handleDragStart({ bottom: true, right: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                width: startSize.current.width - (current.x - start.x),
                                height: startSize.current.height - (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerBoth} ${classes.resizerTopRight}`}
                move={false}
                onDragStart={() => handleDragStart({ bottom: true, left: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                width: startSize.current.width + (current.x - start.x),
                                height: startSize.current.height - (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerBoth} ${classes.resizerBottomLeft}`}
                move={false}
                onDragStart={() => handleDragStart({ top: true, right: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                width: startSize.current.width - (current.x - start.x),
                                height: startSize.current.height + (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            <Draggable
                className={`${classes.resizerBoth} ${classes.resizerBottomRight}`}
                move={false}
                onDragStart={() => handleDragStart({ top: true, left: true })}
                onDragMove={({ start, current }) => {
                    onResize &&
                        onResize({
                            size: {
                                width: startSize.current.width + (current.x - start.x),
                                height: startSize.current.height + (current.y - start.y),
                            },
                        })
                }}
                onDragEnd={handleDragEnd}
            />
            {children}
        </div>
    )
}
