import { CaughtLiveChatRequestMessage } from '@models/Request'

export class Messages extends EventTarget {
    private _list: CaughtLiveChatRequestMessage[]

    public get list() {
        return this._list
    }

    constructor(init: CaughtLiveChatRequestMessage[]) {
        super()
        this._list = init
    }

    add(message: CaughtLiveChatRequestMessage) {
        this._list.push(message)
    }

    pop(): CaughtLiveChatRequestMessage | undefined {
        const poped = this._list.shift()
        if (poped)
            this.dispatchEvent(
                new CustomEvent<CaughtLiveChatRequestMessage>('release', { detail: Object.assign({}, poped) })
            )
        return poped
    }

    popAll() {
        this._list.forEach(message => {
            this.dispatchEvent(
                new CustomEvent<CaughtLiveChatRequestMessage>('release', { detail: Object.assign({}, message) })
            )
        })
        this._list = []
    }

    clear() {
        this._list = []
    }

    addEventListener(name: 'release', listener: EventListener): void {
        super.addEventListener(name, listener)
    }

    removeEventListener(name: 'release', listener: EventListener): void {
        super.removeEventListener(name, listener)
    }
}
