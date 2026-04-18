import type { Product } from '../../types'

export type MarketplaceAdapter = {
    isProductPage: () => boolean
    parseProduct: () => Product | null
}
