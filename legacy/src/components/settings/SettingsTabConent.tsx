import { useScrollBarStyle } from '@/styles/Scrollbar.style'
import { Box } from '@material-ui/core'
import React, { FC, PropsWithChildren } from 'react'

type SettingsTabContent = PropsWithChildren<{
    value: number
    index: number,
    className?: string
}>


export const SettingsTabContent: FC<SettingsTabContent> = ({ children, value, index, className }) => {
    const scrollBarStyles = useScrollBarStyle()
    return (
        <Box
            pt={3}
            minHeight={'450px'}
            hidden={value !== index}
            className={scrollBarStyles.scrollbar + ' ' + className}
        // style={{ overflowY: 'auto' }}
        >
            { children}
        </Box >
    )
}

