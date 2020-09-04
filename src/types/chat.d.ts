
declare namespace YTLiveChat {

    export interface Response {
        reponseContext: ResponseContext
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
        params: { key: string, value: string }[]
    }

    export interface webResponseContextExtensionData {
        ytConfigData?: {
            csn: string,
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
        /**Can be either one, dont know why */

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
            item: LiveChatActionItem
            clientId: string
        }
        markChatItemAsDeletedAction?: {
            deletedStateMessage: {
                runs: MessageRun[]
            }
        }
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

    export interface LiveChatActionItem {
        liveChatPlaceholderItemRenderer?: LiveChatPlaceholderItemRenderer
        liveChatTextMessageRenderer?: LiveChatTextMessageRenderer
    }


    export interface LiveChatTextMessageRenderer {
        message: Message
        authorName: AuthorName
        authorPhoto: AuthorPhoto
        contextMenuEndpoint: ContextMenuEndpoint
        id: string
        authorBadges?: AuthorBadge[]
        authorExternalChannelId: string
        contextMenuAccessibility: ContextMenuAccessibility

    }

    export interface Message {
        runs: MessageRun[]
    }

    export interface AuthorName {
        simpleText: string
    }
    export interface AuthorPhoto {
        thumbnails: Thumbnail[]
    }

    export interface Thumbnail {
        url: string,
        height?: number,
        width?: number
    }


    export interface ContextMenuEndpoint {
        clickTrackingParams: string
        commandMetadata: {
            webCommandMetadata: {
                ignoreNavigation: boolean
            }

        }
        liveChatItemContextMenuEndpoint: {
            params: string
        }
    }

    export interface AuthorBadge {
        liveChatAuthorBadgeRenderer: {
            customThumbnail?: {
                thumbnails: Thumbnail[]
            },
            icon?: {
                iconType: string
            }
            tooltip: string
            accessibility: {
                accessibilityData: AccessibilityData
            }
        }
    }

    export interface ContextMenuAccessibility extends Accessibility { }


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
        text: string,
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
}