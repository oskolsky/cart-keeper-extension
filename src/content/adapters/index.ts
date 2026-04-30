import type { MarketplaceAdapter } from '../../types'
import { genericProductAdapter } from './genericProduct'
import { schemaOrgAdapter } from './schemaOrg'
import { steamAdapter } from './steam'
import { trodoAdapter } from './trodo'

const adapters: MarketplaceAdapter[] = [trodoAdapter, steamAdapter, schemaOrgAdapter, genericProductAdapter]

export const parseProductFromAdapters = () => {
    for (const adapter of adapters) {
        if (!adapter.isProductPage()) continue

        const product = adapter.parseProduct()
        if (product) return product
    }

    return null
}
