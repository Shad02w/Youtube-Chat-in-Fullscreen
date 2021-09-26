declare namespace YTLiveChat {
    export interface Response {
        responseContext: ResponseContext
        continuationContents: ContinuationContents
    }

    /**
     * Response Context
     */
    export interface ResponseContext {
        serviceTrackingParams: ServiceTrackingParam[]
        webResponseContextExtensionData: webResponseContextExtensionData
    }

    export interface ServiceTrackingParam {
        service: string
        params: { key: string; value: string }[]
    }

    export interface webResponseContextExtensionData {
        ytConfigData?: {
            csn: string
            visitorData: string
            sessionIndex: number
        }
        hasDecorated?: boolean
    }

    /**
     * continuationContents
     */
    export interface ContinuationContents {
        liveChatContinuation: {
            continuations: Continuation[]
            actions?: Action[]
            trackingParams?: string
        }
    }

    export interface Continuation {
        /** Can be either one, don't know why */

        // only return when the video page is replay live streaming page
        liveChatReplayContinuationData?: LiveChatReplayContinuationData

        playerSeekContinuationData?: PlayerSeekContinuationData

        invalidationContinuationData?: InvalidationContinuationData

        // only return when the video page is live streaming page
        timedContinuationData?: TimedContinuationData
    }

    export type Action = LiveAction | ReplayLiveAction

    export interface LiveAction {
        addChatItemAction?: {
            item: AddChatActionItemActionItem
            clientId: string
        }

        addLiveChatTickerItemAction?: {
            item: AddLiveChatTickerItemActionItem
            durationSec: string
        }
        markChatItemAsDeletedAction?: {
            deletedStateMessage: {
                runs: MessageRun[]
            }
        }
    }

    export interface AddChatActionItemActionItem {
        liveChatPlaceholderItemRenderer?: LiveChatPlaceholderItemRenderer
        liveChatTextMessageRenderer?: LiveChatTextMessageRenderer
        liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer
        liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer
        liveChatPaidStickerRenderer?: LiveChatPaidStickerRenderer
    }

    export interface ReplayLiveAction {
        replayChatItemAction: {
            actions: LiveAction[]
            videoOffsetTimeMsec: string
        }
    }

    export interface InvalidationContinuationData extends ContinuationData {
        invalidationId: InvalidationId
    }

    export interface LiveChatReplayContinuationData {
        timeUntilLastMessageMsec: number
        continuation: string
    }

    export interface TimedContinuationData extends ContinuationData {
        clickTrackingParams: string
    }

    export interface Text {
        simpleText: string
    }

    export interface AuthorName extends Text {}
    export interface AuthorPhoto {
        thumbnails: Thumbnail[]
    }

    export interface Thumbnail {
        url: string
        height?: number
        width?: number
    }
    type IconType = 'MODERATOR' | 'VERIFIED' | 'OWNER'

    export interface CommandMetadata {
        webCommandMetadata: {
            ignoreNavigation: boolean
        }
    }

    export interface ContextMenuEndpoint {
        clickTrackingParams?: string
        commandMetadata: CommandMetadata
        liveChatItemContextMenuEndpoint: {
            params: string
        }
    }

    export interface AuthorBadge {
        liveChatAuthorBadgeRenderer: {
            customThumbnail?: {
                thumbnails: Thumbnail[]
            }
            icon?: {
                iconType: IconType
            }
            tooltip: string
            accessibility: {
                accessibilityData: AccessibilityData
            }
        }
    }

    export interface ContextMenuAccessibility extends Accessibility {}

    interface ContinuationData {
        continuation: string
        timeoutMs: number
    }

    interface InvalidationId {
        objectId: string
        objectSource: number
        protoCreationTimestampMs: string
        subscribeToGcmTopics: boolean
        topic: string
    }

    interface PlayerSeekContinuationData {
        continuation: string
    }

    interface MessageRun {
        text?: string
        emoji?: Emoji
    }

    interface Message {
        runs: MessageRun[]
    }

    interface AccessibilityData {
        label: string
    }

    interface Accessibility {
        accessibilityData: AccessibilityData
    }

    interface LiveChatPlaceholderItemRenderer {
        id: string
        timestampUsec: string
    }

    export interface Emoji {
        emojiId: string
        shortcuts: string[]
        searchTerms: string[]
        image: Image
        isCustomEmoji: boolean
    }

    export interface Image {
        thumbnails: Thumbnail[]
        accessibility: Accessibility
    }

    export interface AddLiveChatTickerItemActionItem {
        liveChatTickerSponsorItemRenderer: LiveChatTickerSponsorItemRenderer
    }

    export interface LiveChatTickerSponsorItemRenderer {
        id: string
        detailText: Text
        detailTextColor: number
        startBackgroundColor: number
        endBackgroundColor: number
        durationSec: number
        showItemEndpoint: ShowItemEndpoint
        authorExternalChannelId: string
        fullDurationSec: number
        sponsorPhoto: any
    }

    export interface ShowItemEndpoint {
        showLiveChatItemEndpoint: ShowLiveChatItemEndpoint
        commandMetadata: CommandMetadata
    }

    export interface ShowLiveChatItemEndpoint {
        renderer: Renderer
    }

    export interface Sticker {
        thumbnails: Thumbnail[]
    }

    export interface TickerThumbnails {
        thumbnails: Thumbnail[]
        accessibility: Accessibility
    }

    export interface Renderer {
        liveChatMembershipItemRenderer: LiveChatRenderer
    }

    export interface LiveChatRenderer {
        id: string
        timestampUsec: string
        authorExternalChannelId: string
        authorName: AuthorName
        authorPhoto: AuthorPhoto
        timestampText: Text
        contextMenuEndpoint: ContextMenuEndpoint
        contextMenuAccessibility: ContextMenuAccessibility
        // authorPhoto: OrPhoto;
    }

    export interface LiveChatMembershipItemRenderer extends LiveChatRenderer {
        headerSubtext: Message
        authorBadges: AuthorBadge[]
    }

    export interface LiveChatTextMessageRenderer extends LiveChatRenderer {
        message: Message
        authorBadges?: AuthorBadge[]
    }

    export interface LiveChatPaidMessageRenderer extends LiveChatRenderer {
        purchaseAmountText: Text
        headerBackgroundColor: number
        headerTextColor: number
        bodyBackgroundColor: number
        bodyTextColor: number
        authorNameTextColor: number
        timestampColor: number
        message?: Message
    }
    export interface LiveChatPaidStickerRenderer extends LiveChatRenderer {
        sticker: Sticker
        moneyChipBackgroundColor: number
        moneyChipTextColor: number
        purchaseAmountText: Text
        stickerDisplayWidth: number
        stickerDisplayHeight: number
        backgroundColor: number
        authorNameTextColor: number
    }

    export interface LiveChatTickerPaidStickerItemRenderer extends LiveChatRenderer {
        startBackgroundColor: number
        endBackgroundColor: number
        durationSec: number
        fullDurationSec: number
        showItemEndpoint: ShowItemEndpoint
        tickerThumbnail: Thumbnail[]
    }
}
