import { useUrl } from '@hooks/useUrl'
import parse from 'url-parse'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppContext } from '@contexts/AppContext'
import { usePageType } from '@hooks/usePageType'
import { useFullscreenState } from '@hooks/useFullscreenState'
import { useNativeChatFilter } from '@hooks/useNativeChatFilter'


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
    const [iframeLoaded, setIframeLoaded] = useState(0)
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const locationRef = useRef(location)
    locationRef.current = location


    useEffect(() => {
        if ((pageType !== 'init-live-chat' && pageType !== 'live-chat') || !locationRef.current) return setUrl(undefined)
        const query = parse(locationRef.current.href, true).query
        const vid = query['v']
        if (!vid) return setUrl(undefined)
        setUrl(`https://www.youtube.com/live_chat?v=${vid}`)
    }, [pageType])

    useEffect(() => {
        if (!url || !isFullscreen) setShowOverlay(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, isFullscreen])

    // Add and remove hidden class according to chat filter in storage
    useNativeChatFilter(iframeRef, iframeLoaded)

    useUrl((loc) => {
        setLocation(loc)
        setUrl(undefined)
        setShowOverlay(false)
    })

    const handleOnLoad = () => {
        setShowOverlay(true)
        if (!iframeRef.current || !iframeRef.current.contentDocument) return
        const link = document.createElement('link')
        const styleSrc = chrome.runtime.getURL('css/NativeChatFilter.css')
        link.href = styleSrc
        link.rel = 'stylesheet'
        link.type = 'text/css'
        iframeRef.current.contentDocument.head.appendChild(link)
        setIframeLoaded(pre => pre + 1)
    }

    // only load iframe after fullscreen
    if (url && isFullscreen) {
        return (
            <div>
                <iframe
                    onLoad={handleOnLoad}
                    className={styles.iframe}
                    src={url}
                    ref={iframeRef}
                    title={'Native chat room'}
                ></iframe>
            </div>
        )
    } else {
        return <></>
    }
}

