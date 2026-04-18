import type { SavedProduct } from '../../types'

export type MarketplaceAdapter = {
    id: string
    displayName: string
    isProductPage: () => boolean
    parseProduct: () => SavedProduct | null
}
