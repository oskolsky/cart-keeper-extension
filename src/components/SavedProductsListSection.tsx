import { type ReactNode, useEffect, useState } from 'react'

import { ChevronDown, ChevronRight } from 'lucide-react'

type SavedProductsListSectionProps = {
    children: ReactNode
    title: string
    count: number
    autoExpandRequestId: number
}

export const SavedProductsListSection = ({
    children,
    title,
    count,
    autoExpandRequestId,
}: SavedProductsListSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (autoExpandRequestId > 0) {
            setIsExpanded(true)
        }
    }, [autoExpandRequestId])

    return (
        <section>
            <button
                type="button"
                className="sticky top-0 z-10 flex w-full cursor-pointer items-center justify-between border-b border-gray-300 bg-white py-3 text-left text-gray-500 hover:text-gray-700"
                onClick={() => setIsExpanded(currentValue => !currentValue)}
            >
                <div className="flex min-w-0 items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                    {isExpanded ? (
                        <ChevronDown size={14} strokeWidth={2.4} className="shrink-0" aria-hidden="true" />
                    ) : (
                        <ChevronRight size={14} strokeWidth={2.4} className="shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">{title}</span>
                </div>
                <span className="text-xs font-semibold">{count}</span>
            </button>
            {isExpanded && <div>{children}</div>}
        </section>
    )
}
