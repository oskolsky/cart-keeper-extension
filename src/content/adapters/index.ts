import { genericProductAdapter } from './genericProduct'
import { schemaOrgAdapter } from './schemaOrg'
import { trodoAdapter } from './trodo'
import type { MarketplaceAdapter } from './types'

const adapters: MarketplaceAdapter[] = [schemaOrgAdapter, trodoAdapter, genericProductAdapter]

export const getActiveAdapter = () => {
    return adapters.find(adapter => adapter.isProductPage()) ?? null
}
