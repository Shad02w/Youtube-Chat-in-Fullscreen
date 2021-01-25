import { AdvancedChatLiveAction } from "./Chat"

export interface ChatFilter {
    member: boolean
    superchat: boolean
    membership: boolean
    moderator: boolean
    owner: boolean
    guest: boolean
    sticker: boolean
}
export const ChatFilter_Default: ChatFilter = {
    guest: true,
    member: true,
    superchat: true,
    owner: true,
    membership: true,
    moderator: true,
    sticker: true
}

export const checkBadgeType = (badges: YTLiveChat.AuthorBadge[] | undefined, type: YTLiveChat.IconType) => {
    return (badges
        && badges.some(badge => (badge.liveChatAuthorBadgeRenderer && badge.liveChatAuthorBadgeRenderer.icon && badge.liveChatAuthorBadgeRenderer.icon.iconType && badge.liveChatAuthorBadgeRenderer.icon.iconType === type))
    )
}

export const isMember = (badges: YTLiveChat.AuthorBadge[] | undefined) => {
    return (badges
        && badges.some(badge => badge.liveChatAuthorBadgeRenderer.customThumbnail))
}

export const getChatType = (action: AdvancedChatLiveAction): keyof ChatFilter => {
    const { liveChatMembershipItemRenderer, liveChatTextMessageRenderer, liveChatPaidMessageRenderer } = action.addChatItemAction!.item
    if (liveChatTextMessageRenderer && checkBadgeType(liveChatTextMessageRenderer.authorBadges, 'OWNER'))
        return 'owner'
    else if (liveChatTextMessageRenderer && checkBadgeType(liveChatTextMessageRenderer.authorBadges, 'MODERATOR'))
        return 'moderator'
    else if (liveChatTextMessageRenderer && isMember(liveChatTextMessageRenderer.authorBadges))
        return 'member'
    else if (liveChatPaidMessageRenderer)
        return 'superchat'
    else if (liveChatMembershipItemRenderer)
        return 'membership'
    return 'guest'
}

export const shouldBeFiltered = (action: AdvancedChatLiveAction, chatFilter: ChatFilter): boolean => chatFilter[getChatType(action)]
