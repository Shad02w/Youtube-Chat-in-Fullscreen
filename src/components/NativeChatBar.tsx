import { AppContext } from '@contexts/AppContext'
import { useUrl } from '@hooks/useUrl'
import parse from 'url-parse'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    iframe: {
        width: '100%',
        height: 'min-content'
    }
})

export const NativeChatBar = () => {

    const styles = useStyles()

    const { pageType } = useContext(AppContext)
    const [location, setLocation] = useState<Location | undefined>(undefined)
    const locationRef = useRef(location)
    locationRef.current = location
    const url = useMemo(() => {
        if ((pageType !== 'init-live-chat' && pageType !== 'live-chat') || !locationRef.current) return undefined
        console.log('location in use memo url', pageType, locationRef.current)
        const query = parse(locationRef.current.href, true).query
        const vid = query['v']
        if (!vid) return undefined
        return `https://www.youtube.com/live_chat?v=${vid}`
    }, [pageType])

    useUrl(setLocation)

    useEffect(() => {
        console.log('iframe url', url)
    }, [url])


    if (url) {
        return (
            <div>
                <iframe
                    className={styles.iframe}
                    src={url}
                    title={'Native chat room'}
                ></iframe>
            </div>
        )
    } else {
        return <></>
    }
}

