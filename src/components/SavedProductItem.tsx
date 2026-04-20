import type { SavedProduct } from '../types'
import { withTracking } from '../utils/tracking'

type SavedProductItemProps = {
    item: SavedProduct
    onRemove: (url: string) => void
}

const formatSavedAt = (savedAt: string) => {
    return new Intl.DateTimeFormat(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(savedAt))
}

export const SavedProductItem = ({ item, onRemove }: SavedProductItemProps) => {
    const productUrl = withTracking(item.url)

    const handleRemove = () => {
        onRemove(item.url)
    }

    return (
        <div className="flex gap-x-5 border-b border-gray-200 px-3 py-5">
            <a href={productUrl} target="_blank" rel="noreferrer" className="shrink-0">
                <img src={item.imageUrl} alt={item.name} className="size-16" />
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
                    <div className="text-xs text-gray-400 uppercase">{formatSavedAt(item.savedAt)}</div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        {item.currency} {item.price.toFixed(2)}
                    </div>

                    <button
                        type="button"
                        className="cursor-pointer text-sm font-medium text-[#0f766e] hover:text-[#115e59]"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}
