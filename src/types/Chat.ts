interface Image {
    url: string
}

interface Badge extends Image {}
interface Emoji extends Image {}
interface Avatar extends Image {}

interface Author {
    badge?: Badge
    name: string
    avatar: Avatar
}

type Message =
    | {
          type: 'text'
          text: string
      }
    | {
          type: 'emoji'
          image: Emoji
      }

interface ChatItem {
    author: Author
    messages: Message[]
}

interface Chat {
    items: ChatItem[]
    timestamp: number
    interval: number
}
