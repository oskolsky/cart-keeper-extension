const UTM_SOURCE = 'cart_keeper_extension'

export const withTracking = (url: string) => {
    try {
        const trackedUrl = new URL(url)
        trackedUrl.searchParams.set('utm_source', UTM_SOURCE)
        return trackedUrl.toString()
    } catch {
        const separator = url.includes('?') ? '&' : '?'
        return `${url}${separator}utm_source=${UTM_SOURCE}`
    }
}
