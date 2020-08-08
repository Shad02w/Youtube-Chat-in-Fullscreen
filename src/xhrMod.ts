interface XMLHttpRequest {
    url: string
}

(function () {
    console.log('xhrMod injected')
    const XHR = XMLHttpRequest.prototype
    const open = XHR.open
    const send = XHR.send

    XHR.open = function (method: string, url: string) {
        console.log('open', url)
        this.url = url
        return open.apply(this, arguments as any)
    }

    XHR.send = function () {
        // this.addEventListener('readystatechange', function () {
        //     console.log(`xhr readystatechange ${this.url}`)
        // })
        // this.addEventListener('progress', function () {
        //     console.log(`xhr progress ${this.url}`)
        // })
        this.addEventListener('load', function () {
            // console.log(`xhr onload ${this.url}`)
            if (this.url.includes('https://www.youtube.com/live_chat/get_live_chat')) {
                const dataDomElment = document.createElement('div')
                dataDomElment.id = '__interceptedData'
                dataDomElment.innerText = this.response
                dataDomElment.style.height = '0';
                dataDomElment.style.overflow = 'hidden'
                console.log('intercepted Data', this.response)
                document.body.appendChild(dataDomElment)
            }
        })
        return send.apply(this, arguments as any)
    }
})()