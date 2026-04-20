import { useEffect, useState } from 'react'

import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { SavedProductsList } from './components/SavedProductsList'
import type { Product, SavedProduct } from './types'
import { getProductFromPage } from './utils/currentProduct'
import { getSavedProducts, removeSavedProduct, saveProduct } from './utils/storage'

export default function App() {
    const [items, setItems] = useState<SavedProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

    const isCurrentProductSaved = currentProduct ? items.some(item => item.url === currentProduct.url) : false

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
                <div className="flex min-h-0 flex-1 flex-col">
                    <SavedProductsList items={items} onRemove={handleRemoveProduct} />
                </div>
            )}
        </div>
    )
}
