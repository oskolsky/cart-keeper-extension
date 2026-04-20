import { useState } from 'react'

import type { SavedProduct } from '../types'
import { getMarketplaceGroupKey } from '../utils/marketplace'
import { EmptyState } from './EmptyState'
import { SavedProductItem } from './SavedProductItem'
import { SavedProductsListSection } from './SavedProductsListSection'

type SavedProductsListProps = {
    items: SavedProduct[]
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

export const SavedProductsList = ({ items, onRemove }: SavedProductsListProps) => {
    const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(() => new Set())

    if (items.length === 0) {
        return <EmptyState />
    }

    const groups = groupItemsByMarketplace(items)

    const handleToggleGroup = (groupKey: string) => {
        setCollapsedGroupKeys(currentKeys => {
            const nextKeys = new Set(currentKeys)

            if (nextKeys.has(groupKey)) {
                nextKeys.delete(groupKey)
            } else {
                nextKeys.add(groupKey)
            }

            return nextKeys
        })
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
                        isExpanded={!collapsedGroupKeys.has(groupKey)}
                        onToggle={() => handleToggleGroup(groupKey)}
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
