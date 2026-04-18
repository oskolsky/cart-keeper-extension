import { useEffect, useState } from 'react'

import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { SaveProductButton } from './components/SaveProductButton'
import { SavedProductsList } from './components/SavedProductsList'
import type { SavedProduct } from './types'
import { getProductFromPage } from './utils/currentProduct'
import { addSavedProduct, getSavedProducts, removeSavedProduct } from './utils/storage'

export default function App() {
    const [items, setItems] = useState<SavedProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [currentProduct, setCurrentProduct] = useState<SavedProduct | null>(null)

    useEffect(() => {
        const init = async () => {
            const [data, response] = await Promise.all([getSavedProducts(), getProductFromPage()])
            setItems(data)

            if (response?.success && response.product) {
                setCurrentProduct(response.product)
            } else {
                setCurrentProduct(null)
            }

            setLoading(false)
        }

        init()
    }, [])

    const handleAdd = async () => {
        if (!currentProduct) return

        const updated = await addSavedProduct(currentProduct)
        setItems(updated)
    }

    const handleRemove = async (id: string) => {
        const updated = await removeSavedProduct(id)
        setItems(updated)
    }

    return (
        <div className="w-94.5 bg-white text-gray-900">
            <Header count={items.length} />

            {loading ? (
                <Loader />
            ) : (
                <div>
                    {currentProduct ? <SaveProductButton onClick={handleAdd} /> : <div className="h-5" />}
                    <SavedProductsList items={items} onRemove={handleRemove} />
                </div>
            )}
        </div>
    )
}
