import { CatchedLiveChatRequestMessage } from './Request';

export class Messages extends EventTarget {
    private _list: CatchedLiveChatRequestMessage[]

    public get list() {
        return this._list
    }

    constructor(init: CatchedLiveChatRequestMessage[]) {
        super()
        this._list = init
    }

    add(message: CatchedLiveChatRequestMessage) {
        this._list.push(message)
    }

    pop(): CatchedLiveChatRequestMessage | undefined {
        const poped = this._list.shift()
        if (poped) this.dispatchEvent(new CustomEvent<CatchedLiveChatRequestMessage>('release', { detail: Object.assign({}, poped) }))
        return poped
    }

    popAll() {
        this._list.forEach((message) => {
            this.dispatchEvent(new CustomEvent<CatchedLiveChatRequestMessage>('release', { detail: Object.assign({}, message) }))
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

