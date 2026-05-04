import { ShoppingBasketIcon } from 'lucide-react'

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center px-5 py-15 text-center text-gray-500">
        <ShoppingBasketIcon size={34} strokeWidth={1.8} className="mb-4 text-gray-300" aria-hidden="true" />
        <p className="text-sm font-medium">No saved products yet</p>
        <p className="mt-1 max-w-55 text-xs leading-5 text-gray-400">
            Open any product page and click Add to save it here.
        </p>
    </div>
)
