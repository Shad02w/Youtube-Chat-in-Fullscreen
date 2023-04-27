export const isScrollUpDetectorCreator = (threshold: number) => {
    // skip for first 'UP', then comfirm next turn
    let scrollHeight_last = -1
    let isScrollUp_last = false
    return (scrollTop: number, clientHeight: number, scrollHeight: number): boolean => {
        let result: boolean

        // determine current scroll data
        const sum = scrollTop + clientHeight
        const isScrollUp = Math.abs(sum - scrollHeight) > threshold
        const equalToScrollHeight_last = Math.abs(sum - scrollHeight_last) < threshold

        if (isScrollUp && isScrollUp_last && !equalToScrollHeight_last) result = true
        else result = false

        if (isScrollUp) isScrollUp_last = true
        else isScrollUp_last = false

        if (result) isScrollUp_last = false

        scrollHeight_last = scrollHeight

        return result
    }
}
