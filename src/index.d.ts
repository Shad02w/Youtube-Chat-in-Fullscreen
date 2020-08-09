declare namespace YoutubeLiveChat {

    interface LiveChat {
        csn: string
        url: string
        response: LiveChatResponse
        xsrf_token: string
        timming: Timming
        endpoint: Endpoint
    }

    interface LiveChatReplay {
        csn: string
        url: string
        response: LiveChatReplayResponse
        xsrf_token: string
        timming: any
    }

    interface LiveChatResponse {
        responseContext: ResponseContext
        continuationContents: ContinuationContents
        trackingParams: string
    }

    interface ResponseContext {
        serviceTrackingParams: ServiceTrackingParam[]
        webResponseContextExtensionData: {
            ytConfigData: {
                csn: string,
                visitorData: string
                sessionIndex: number
            }
            hasDecorated: boolean
        }
    }

    interface KeyValuePair<T, K> {
        key: T
        value: K
    }

    interface ServiceTrackingParam {
        service: string
        params: KeyValuePair<string, string>[]
    }

    interface ContinuationContents {
        liveChatContinuation: {
            continuations: Continuation[]
            actions: LiveChatContinuationAction[]
            trackingParams: string
        }
    }

    interface Continuation {
        timedContinuationData: {
            timoutMs: number,
            continuation: string
            clickTrackingParams: string
        }
    }

    interface LiveChatContinuationAction {
        addChatItemAction: {
            item: LiveChatActionItem
            clientId: string
        }
    }

    interface LiveChatActionItem {
        liveChatTextMessageRenderer: LiveChatTextMessageRenderer
    }

    interface AccessibilityData {
        label: string
    }

    interface Accessibility {
        accessibilityData: AccessibilityData
    }

    interface LiveChatTextMessageRenderer {
        message: LiveChatTextMessageRenderer.Message
        authorName: LiveChatTextMessageRenderer.AuthorName
        authorPhoto: LiveChatTextMessageRenderer.AuthorPhoto
        contextMenuEndpoint: LiveChatTextMessageRenderer.ContextMenuEndpoint
        id: string
        authorBadges: LiveChatTextMessageRenderer.AuthorBadge
        authorExternalChannelId: string
        contextMenuAccessibility: LiveChatTextMessageRenderer

    }

    namespace LiveChatTextMessageRenderer {

        interface Message {
            runs: MessageRun[]
        }

        interface AuthorName {
            simpleText: string
        }
        interface AuthorPhoto {
            thumbnails: Thumbnail[]
        }

        interface Thumbnail {
            url: string,
            height?: number,
            width?: number
        }

        interface MessageRun {
            text: string
        }

        interface ContextMenuEndpoint {
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

        interface AuthorBadge {
            liveChatAuthorBadgeRenderer: {
                customThumbnail: {
                    thumbnails: Thumbnail[]
                }
                tooltip: string
                accessibility: {
                    accessibilityData: AccessibilityData
                }
            }
        }

        interface ContextMenuAccessibility extends Accessibility { }

    }
    interface Timming {
        info: {
            st: number
        }
    }

    interface Endpoint {
        commandMetadata: CommandMetadata
        urlEndpoint: {
            url: string
        }

    }

    interface CommandMetadata {
        webCommandMetadata: WebCommandMetadata
    }

    interface WebCommandMetadata {
        ignoreNavigation: boolean
        url: string
    }



}

