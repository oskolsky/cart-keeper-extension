import { DEFAULT_MARKETPLACE } from '../marketplaces'
import type { SavedProduct } from '../types'

export const getProductMarketplaceName = (product: SavedProduct) => {
    return product.marketplaceName || product.category || DEFAULT_MARKETPLACE.displayName
}
