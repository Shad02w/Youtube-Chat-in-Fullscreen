export interface Image {
    url: string
}

export interface Avatar extends Image {}
export interface Badge extends Image {}

export interface Author {
    badge?: Badge
    name: string
    avatar: Avatar
    type: 'MODERATOR' | 'VERIFIED' | 'OWNER' | null
}

export interface Emoji extends Image {}

export type Text =
    | {
          type: 'text'
          text: string
      }
    | {
          type: 'emoji'
          image: Emoji
      }

export interface LiveChatMessageBase {
    author: Author
    text: Text[]
}

export interface LiveChatMembershipMessage extends LiveChatMessageBase {
    message: Text[]
}

export interface LiveChatPaidMessage extends LiveChatMessageBase {
    amount: number
    bodyBackgroundColor: string
    bodyTextColor: string
    headerBackgroundColor: string
    headerTextColor: string
    authorNameTextColor: string
    message: Text[] | null
}

export interface Sticker extends Image {}

export interface LiveChatPaidStickerMessage extends Omit<LiveChatPaidMessage, 'message'> {
    sticker: Sticker
}

export type LiveChatMessage = LiveChatMessageBase | LiveChatPaidMessage | LiveChatMembershipMessage | LiveChatPaidStickerMessage

export interface Chat {
    items: LiveChatMessage[]
    timestamp: number
    interval: number
}
