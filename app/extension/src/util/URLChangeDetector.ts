type Subscriber = () => void

export class URLChangeDetector {
    private static url = window.location.href
    private static subscribers = new Set<Subscriber>()
    private static observer = new MutationObserver(() => {
        if (this.url !== window.location.href) {
            this.url = window.location.href
            this.notify()
        }
    })

    static {
        this.observer.observe(document.body, { childList: true, subtree: true })
    }

    static subscribe(subscriber: Subscriber): () => void {
        this.subscribers.add(subscriber)
        return () => {
            this.subscribers.delete(subscriber)
        }
    }

    private static notify() {
        this.subscribers.forEach((subscriber) => subscriber())
    }
}
