const TRACKING_PARAM_NAMES = new Set(['fbclid', 'gclid', 'gbraid', 'mc_cid', 'mc_eid', 'msclkid', 'wbraid'])

const isTrackingParam = (name: string) => {
    return name.toLowerCase().startsWith('utm_') || TRACKING_PARAM_NAMES.has(name.toLowerCase())
}

export const normalizeProductUrl = (url: string) => {
    try {
        const normalizedUrl = new URL(url)
        const trackingParamNames = Array.from(normalizedUrl.searchParams.keys()).filter(isTrackingParam)

        trackingParamNames.forEach(name => {
            normalizedUrl.searchParams.delete(name)
        })

        normalizedUrl.hash = ''
        normalizedUrl.searchParams.sort()

        return normalizedUrl.toString()
    } catch {
        return url
    }
}

export const isSameProductUrl = (firstUrl: string, secondUrl: string) => {
    return normalizeProductUrl(firstUrl) === normalizeProductUrl(secondUrl)
}
