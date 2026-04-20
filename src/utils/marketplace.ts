import type { Product } from '../types'

type MarketplaceData = Pick<Product, 'marketplaceName' | 'marketplaceUrl'>

export const getMarketplaceGroupKey = ({ marketplaceName, marketplaceUrl }: MarketplaceData) => {
    return `${marketplaceName}:${marketplaceUrl}`
}
