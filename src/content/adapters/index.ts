import { genericProductAdapter } from './genericProduct'
import { schemaOrgAdapter } from './schemaOrg'
import { trodoAdapter } from './trodo'
import type { MarketplaceAdapter } from './types'

const adapters: MarketplaceAdapter[] = [schemaOrgAdapter, trodoAdapter, genericProductAdapter]

export const parseProductFromAdapters = () => {
    for (const adapter of adapters) {
        if (!adapter.isProductPage()) continue

        const product = adapter.parseProduct()
        if (product) return product
    }

    return null
}
