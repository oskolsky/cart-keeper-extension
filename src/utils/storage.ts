import type { Product, SavedProduct } from '../types'

const SAVED_PRODUCTS_STORAGE_KEY = 'favorites'

export const getSavedProducts = async (): Promise<SavedProduct[]> => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        return []
    }

    const data = await chrome.storage.local.get(SAVED_PRODUCTS_STORAGE_KEY)
    const value = data[SAVED_PRODUCTS_STORAGE_KEY]
    return Array.isArray(value) ? (value as SavedProduct[]) : []
}

const saveSavedProducts = async (items: SavedProduct[]) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return

    await chrome.storage.local.set({ [SAVED_PRODUCTS_STORAGE_KEY]: items })
}

export const saveProduct = async (product: Product) => {
    const items = await getSavedProducts()
    const filtered = items.filter(item => item.url !== product.url)
    const updated = [{ ...product, savedAt: new Date().toISOString() }, ...filtered]
    await saveSavedProducts(updated)
    return updated
}

export const removeSavedProduct = async (url: string) => {
    const items = await getSavedProducts()
    const updated = items.filter(item => item.url !== url)
    await saveSavedProducts(updated)
    return updated
}
