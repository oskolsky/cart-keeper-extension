import { trodoAdapter } from './trodo'
import type { MarketplaceAdapter } from './types'

const adapters: MarketplaceAdapter[] = [trodoAdapter]

export const getActiveAdapter = () => {
    return adapters.find(adapter => adapter.isProductPage()) ?? null
}
