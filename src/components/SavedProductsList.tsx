import type { SavedProduct } from '../types'
import { getProductMarketplaceName } from '../utils/savedProducts'
import { EmptyState } from './EmptyState'
import { SavedProductItem } from './SavedProductItem'

type SavedProductsListProps = {
    items: SavedProduct[]
    onRemove: (id: string) => void
}

type SavedProductsGroup = {
    marketplaceName: string
    items: SavedProduct[]
}

const groupItemsByMarketplace = (items: SavedProduct[]) => {
    return items.reduce<SavedProductsGroup[]>((groups, item) => {
        const marketplaceName = getProductMarketplaceName(item)
        const group = groups.find(currentGroup => currentGroup.marketplaceName === marketplaceName)

        if (group) {
            group.items.push(item)
            return groups
        }

        groups.push({
            marketplaceName,
            items: [item],
        })

        return groups
    }, [])
}

export const SavedProductsList = ({ items, onRemove }: SavedProductsListProps) => {
    if (items.length === 0) return <EmptyState />

    const groups = groupItemsByMarketplace(items)

    return (
        <div className="max-h-112.5 overflow-y-auto px-5 pb-1">
            {groups.map(group => (
                <section key={group.marketplaceName} className="pt-4 first:pt-0">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white py-2">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {group.marketplaceName}
                        </h2>
                        <span className="text-xs text-gray-400">{group.items.length}</span>
                    </div>

                    {group.items.map(item => (
                        <SavedProductItem key={item.id} item={item} onRemove={onRemove} />
                    ))}
                </section>
            ))}
        </div>
    )
}
