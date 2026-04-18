import type { SavedProduct } from '../types'
import { withTracking } from '../utils/tracking'

type SavedProductItemProps = {
    item: SavedProduct
    onRemove: (id: string) => void
}

export const SavedProductItem = ({ item, onRemove }: SavedProductItemProps) => {
    const productUrl = withTracking(item.url)

    return (
        <div className="flex w-full gap-x-5 border-t border-gray-300 py-5 first:border-t-0">
            <a href={productUrl} target="_blank" rel="noreferrer" className="shrink-0">
                <img src={item.imageUrl} alt={item.name} className="size-15" />
            </a>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <a
                        href={productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-1 text-sm font-medium hover:text-[#0f766e]"
                    >
                        {item.name}
                    </a>
                    <div className="mt-1 text-xs text-gray-400">ID: {item.productId}</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        {item.currency} {item.price.toFixed(2)}
                    </div>
                    <button
                        type="button"
                        className="cursor-pointer text-sm font-medium text-[#0f766e] hover:text-[#115e59]"
                        onClick={() => onRemove(item.id)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}
