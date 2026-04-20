export const getPageMarketplaceName = () => {
    return window.location.hostname.replace(/^www\./, '')
}

export const getPageMarketplaceUrl = () => {
    return window.location.origin
}
