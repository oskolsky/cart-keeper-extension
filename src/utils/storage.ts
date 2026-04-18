import { DEFAULT_MARKETPLACE } from '../marketplaces'
import type { SavedProduct } from '../types'

const SAVED_PRODUCTS_STORAGE_KEY = 'favorites'

type StoredSavedProduct = Omit<SavedProduct, 'marketplaceId' | 'marketplaceName'> &
    Partial<Pick<SavedProduct, 'marketplaceId' | 'marketplaceName'>>

const normalizeSavedProduct = (item: StoredSavedProduct): SavedProduct => {
    const marketplaceName = item.marketplaceName || item.category || DEFAULT_MARKETPLACE.displayName
    const marketplaceId = item.marketplaceId || DEFAULT_MARKETPLACE.id

    return {
        ...item,
        marketplaceId,
        marketplaceName,
        category: item.category || marketplaceName,
    }
}

export const getSavedProducts = async (): Promise<SavedProduct[]> => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        return []
    }

    const data = await chrome.storage.local.get(SAVED_PRODUCTS_STORAGE_KEY)
    const value = data[SAVED_PRODUCTS_STORAGE_KEY]
    return Array.isArray(value) ? (value as StoredSavedProduct[]).map(normalizeSavedProduct) : []
}

export const saveSavedProducts = async (items: SavedProduct[]) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return

    await chrome.storage.local.set({ [SAVED_PRODUCTS_STORAGE_KEY]: items })
}

export const addSavedProduct = async (item: SavedProduct) => {
    const items = await getSavedProducts()
    const normalizedItem = normalizeSavedProduct(item)
    const filtered = items.filter(currentItem => currentItem.id !== normalizedItem.id)
    const updated = [normalizedItem, ...filtered]
    await saveSavedProducts(updated)
    return updated
}

export const removeSavedProduct = async (id: string) => {
    const items = await getSavedProducts()
    const updated = items.filter(item => item.id !== id)
    await saveSavedProducts(updated)
    return updated
}
