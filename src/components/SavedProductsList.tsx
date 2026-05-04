import { useMemo } from 'react'

import type { SavedProduct } from '../types'
import { getMarketplaceGroupKey } from '../utils/marketplace'
import { EmptyState } from './EmptyState'
import { SavedProductItem } from './SavedProductItem'
import { SavedProductsListSection } from './SavedProductsListSection'

type SavedProductsListProps = {
    items: SavedProduct[]
    autoExpandedGroupKey?: string | null
    autoExpandRequestId: number
    onRemove: (url: string) => void
}

type SavedProductsGroup = {
    marketplaceName: string
    marketplaceUrl: string
    items: SavedProduct[]
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

export const SavedProductsList = ({
    items,
    autoExpandedGroupKey,
    autoExpandRequestId,
    onRemove,
}: SavedProductsListProps) => {
    const groups = useMemo(() => groupItemsByMarketplace(items), [items])

    if (items.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
            {groups.map(group => {
                const groupKey = getMarketplaceGroupKey(group)

                return (
                    <SavedProductsListSection
                        key={groupKey}
                        title={group.marketplaceName}
                        count={group.items.length}
                        autoExpandRequestId={autoExpandedGroupKey === groupKey ? autoExpandRequestId : 0}
                    >
                        {group.items.map(item => (
                            <SavedProductItem key={item.url} item={item} onRemove={onRemove} />
                        ))}
                    </SavedProductsListSection>
                )
            })}
        </div>
    )
}
