import { ShoppingCart } from 'lucide-react'

import { DEFAULT_MARKETPLACE } from '../marketplaces'
import { withTracking } from '../utils/tracking'

type HeaderProps = {
    count: number
}

export const Header = ({ count }: HeaderProps) => {
    return (
        <div className="sticky top-0 z-20 bg-white px-5">
            <div className="flex items-center justify-between py-5">
                <a
                    href={withTracking(DEFAULT_MARKETPLACE.homepageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#0f766e] text-white">
                        <ShoppingCart size={18} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <span className="text-base font-bold text-gray-900">Cart Keeper</span>
                </a>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">Saved</span>

                    {count > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#de3618] px-1 text-xs font-semibold text-white">
                            {count}
                        </span>
                    )}
                </div>
            </div>

            <hr className="border-gray-300" />
        </div>
    )
}
