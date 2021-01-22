import { PageType } from "@models/Request"
import { useState } from "react"
import { useBackgroundMessage } from "./useBackgroundMessage"

export const usePageType = () => {

    const [pageType, setPageType] = useState<PageType>('normal')

    useBackgroundMessage((message) => {
        setPageType(message.type)
    })

    return { pageType }
}

