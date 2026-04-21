const TRACKING_PARAM_NAMES = new Set([
    '_x_sessn_id',
    'ab_scene',
    'enable_vqr',
    'fbclid',
    'freesia_scene',
    'gbraid',
    'gclid',
    'mc_cid',
    'mc_eid',
    'msclkid',
    'refer_page_el_sn',
    'refer_page_id',
    'refer_page_name',
    'refer_page_sn',
    'spec_gallery_id',
    'top_gallery_url',
    'wbraid',
])

const isTrackingParam = (name: string) => {
    const normalizedName = name.toLowerCase()

    return (
        normalizedName.startsWith('utm_') ||
        normalizedName.startsWith('_oak_') ||
        normalizedName.startsWith('refer_') ||
        TRACKING_PARAM_NAMES.has(normalizedName)
    )
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
