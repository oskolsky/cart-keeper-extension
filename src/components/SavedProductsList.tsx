import { useMemo } from 'react'

import type { SavedProduct } from '../types'
import { getMarketplaceGroupKey } from '../utils/marketplace'
import { EmptyState } from './EmptyState'
import { SavedProductItem } from './SavedProductItem'
import { SavedProductsListSection } from './SavedProductsListSection'

type SavedProductsListProps = {
    items: SavedProduct[]
    autoOpenGroupRequest: AutoOpenGroupRequest | null
    onRemove: (url: string) => void
}

export type AutoOpenGroupRequest = {
    groupKey: string
    id: number
}

type SavedProductsGroup = {
    marketplaceName: string
    marketplaceUrl: string
    items: SavedProduct[]
}

const groupItemsByMarketplace = (items: SavedProduct[]) => {
    const groupsByKey = new Map<string, SavedProductsGroup>()

    items.forEach(item => {
        const groupKey = getMarketplaceGroupKey(item)
        const group = groupsByKey.get(groupKey)

        if (group) {
            group.items.push(item)
            return
        }

        groupsByKey.set(groupKey, {
            marketplaceName: item.marketplaceName,
            marketplaceUrl: item.marketplaceUrl,
            items: [item],
        })
    })

    return Array.from(groupsByKey.values())
}

export const SavedProductsList = ({ items, autoOpenGroupRequest, onRemove }: SavedProductsListProps) => {
    const groups = useMemo(() => groupItemsByMarketplace(items), [items])

    if (items.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="px-5">
            {groups.map(group => {
                const groupKey = getMarketplaceGroupKey(group)

                return (
                    <SavedProductsListSection
                        key={groupKey}
                        title={group.marketplaceName}
                        count={group.items.length}
                        openRequestId={autoOpenGroupRequest?.groupKey === groupKey ? autoOpenGroupRequest.id : 0}
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
