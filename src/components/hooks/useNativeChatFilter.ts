import { ChatFilter } from "@models/ChatFilter"
import { useEffect, useContext, MutableRefObject } from 'react'
import { StorageContext } from '@contexts/StorageContext'

export const FilterClassNameMap: { [key in keyof ChatFilter]: string } = {
    guest: 'ytcf-guest-hidden',
    member: 'ytcf-member-hidden',
    owner: 'ytcf-owner-hidden',
    moderator: 'ytcf-moderator-hidden',
    superchat: 'ytcf-superchat-hidden',
    sticker: 'ytcf-supersticker-hidden',
    membership: 'ytcf-membership-hidden',
}

export const ContainerId = '_ytcf-container'

export const useNativeChatFilter = (ref: MutableRefObject<HTMLIFrameElement | null>) => {

    const { storage: { chatFilter } } = useContext(StorageContext)

    useEffect(() => {
        if (!ref.current || !ref.current.contentDocument) return
        const container = ref.current.contentDocument.body
        if (!container) return
        const { guest, member, membership, moderator, owner, sticker } = chatFilter

        if (!guest)
            container.classList.add(FilterClassNameMap['guest'])
        else
            container.classList.remove(FilterClassNameMap['guest'])

        if (!member)
            container.classList.add(FilterClassNameMap['member'])
        else
            container.classList.remove(FilterClassNameMap['member'])

        if (!owner)
            container.classList.add(FilterClassNameMap['owner'])
        else
            container.classList.remove(FilterClassNameMap['owner'])

        if (!membership)
            container.classList.add(FilterClassNameMap['membership'])
        else
            container.classList.remove(FilterClassNameMap['membership'])

        if (!moderator)
            container.classList.add(FilterClassNameMap['moderator'])
        else
            container.classList.remove(FilterClassNameMap['moderator'])

        if (!sticker)
            container.classList.add(FilterClassNameMap['sticker'])
        else
            container.classList.remove(FilterClassNameMap['sticker'])

    }, [chatFilter, ref])

}