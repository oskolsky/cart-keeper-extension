import type { SavedProduct } from '../types'
import { withTracking } from '../utils/tracking'
import { EmptyState } from './EmptyState'
import { SavedProductItem } from './SavedProductItem'

type SavedProductsListProps = {
    items: SavedProduct[]
    onRemove: (url: string) => void
}

type SavedProductsGroup = {
    marketplaceName: string
    marketplaceUrl: string
    items: SavedProduct[]
}

type MarketplaceGroupHeaderProps = {
    group: SavedProductsGroup
}

const groupItemsByMarketplace = (items: SavedProduct[]) => {
    return items.reduce<SavedProductsGroup[]>((groups, item) => {
        const { marketplaceName, marketplaceUrl } = item
        const group = groups.find(
            currentGroup =>
                currentGroup.marketplaceName === marketplaceName && currentGroup.marketplaceUrl === marketplaceUrl,
        )

        if (group) {
            group.items.push(item)
            return groups
        }

        groups.push({
            marketplaceName,
            marketplaceUrl,
            items: [item],
        })

        return groups
    }, [])
}

const MarketplaceGroupHeader = ({ group }: MarketplaceGroupHeaderProps) => (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white pb-2">
        <a
            href={withTracking(group.marketplaceUrl)}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold tracking-wide text-gray-500 uppercase hover:text-gray-700"
        >
            {group.marketplaceName}
        </a>
        <span className="text-xs text-gray-400">{group.items.length}</span>
    </div>
)

export const SavedProductsList = ({ items, onRemove }: SavedProductsListProps) => {
    if (items.length === 0) return <EmptyState />

    const groups = groupItemsByMarketplace(items)

    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
            {groups.map(group => (
                <section key={`${group.marketplaceName}:${group.marketplaceUrl}`}>
                    <MarketplaceGroupHeader group={group} />

                    <div>
                        {group.items.map(item => (
                            <SavedProductItem key={item.url} item={item} onRemove={onRemove} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
