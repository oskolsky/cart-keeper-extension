import { useEffect, useState } from 'react'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { type AutoOpenGroupRequest, SavedProductsList } from './components/SavedProductsList'
import type { Product, SavedProduct } from './types'
import { getProductFromPage } from './utils/currentProduct'
import { getMarketplaceGroupKey } from './utils/marketplace'
import { isSameProductUrl } from './utils/productUrl'
import { getSavedProducts, removeSavedProduct, saveProduct } from './utils/storage'

export default function App() {
    const [items, setItems] = useState<SavedProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    const [autoOpenGroupRequest, setAutoOpenGroupRequest] = useState<AutoOpenGroupRequest | null>(null)

    const isCurrentProductSaved = currentProduct
        ? items.some(item => isSameProductUrl(item.url, currentProduct.url))
        : false

    useEffect(() => {
        const init = async () => {
            const [data, response] = await Promise.all([getSavedProducts(), getProductFromPage()])
            setItems(data)

            if (response?.success && response.product) {
                setCurrentProduct(response.product)
            } else {
                setCurrentProduct(null)
            }

            setIsLoading(false)
        }

        init()
    }, [])

    const handleSaveProduct = async () => {
        if (!currentProduct) return

        const updated = await saveProduct(currentProduct)
        setItems(updated)
        setAutoOpenGroupRequest(currentRequest => ({
            groupKey: getMarketplaceGroupKey(currentProduct),
            id: (currentRequest?.id ?? 0) + 1,
        }))
    }

    const handleRemoveProduct = async (url: string) => {
        const updated = await removeSavedProduct(url)
        setItems(updated)
    }

    return (
        <div className="flex max-h-145 w-94.5 flex-col overflow-hidden bg-white text-gray-900">
            <Header
                saveLabel={isCurrentProductSaved ? 'Update' : 'Add'}
                savedProductsCount={items.length}
                hasCurrentProduct={Boolean(currentProduct)}
                onSaveProduct={handleSaveProduct}
            />

            {isLoading ? (
                <Loader />
            ) : (
                <div className="min-h-0 overflow-y-auto">
                    <SavedProductsList
                        items={items}
                        autoOpenGroupRequest={autoOpenGroupRequest}
                        onRemove={handleRemoveProduct}
                    />
                </div>
            )}

            <Footer />
        </div>
    )
}
