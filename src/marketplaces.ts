export type MarketplaceConfig = {
    id: string
    displayName: string
    host: string
    homepageUrl: string
}

export const MARKETPLACES = {
    trodo: {
        id: 'trodo',
        displayName: 'Trodo.com',
        host: 'trodo.com',
        homepageUrl: 'https://trodo.com',
    },
} as const satisfies Record<string, MarketplaceConfig>

export const DEFAULT_MARKETPLACE = MARKETPLACES.trodo

export const SUPPORTED_MARKETPLACES = Object.values(MARKETPLACES)

export const isSupportedMarketplaceUrl = (url: string) => {
    try {
        const { hostname } = new URL(url)
        return SUPPORTED_MARKETPLACES.some(
            marketplace => hostname === marketplace.host || hostname.endsWith(`.${marketplace.host}`),
        )
    } catch {
        return false
    }
}
