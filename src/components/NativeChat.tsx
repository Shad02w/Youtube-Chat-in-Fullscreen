import { useUrl } from '@hooks/useUrl'
import parse from 'url-parse'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppContext } from '@contexts/AppContext'
import { usePageType } from '@hooks/usePageType'
import { useFullscreenState } from '@hooks/useFullscreenState'


const useStyles = makeStyles({
    iframe: {
        width: '100%',
        height: '100%'
    }
})

export const NativeChat = () => {

    const styles = useStyles()

    const { pageType } = usePageType()
    const { isFullscreen } = useFullscreenState()
    const [location, setLocation] = useState<Location | undefined>(undefined)
    const [url, setUrl] = useState<string | undefined>(undefined)
    const { setShowOverlay } = useContext(AppContext)

    const locationRef = useRef(location)
    locationRef.current = location

    useEffect(() => {
        if ((pageType !== 'init-live-chat' && pageType !== 'live-chat') || !locationRef.current) return setUrl(undefined)
        const query = parse(locationRef.current.href, true).query
        const vid = query['v']
        if (!vid) return setUrl(undefined)
        setUrl(`https://www.youtube.com/live_chat?v=${vid}`)
    }, [pageType])

    useUrl((loc) => {
        setLocation(loc)
        setUrl(undefined)
        setShowOverlay(false)
    })


    const handleOnLoad = () => {
        setShowOverlay(true)
    }

    // only load iframe after fullscreen
    if (url && isFullscreen) {
        return (
            <div>
                <iframe
                    onLoad={handleOnLoad}
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

