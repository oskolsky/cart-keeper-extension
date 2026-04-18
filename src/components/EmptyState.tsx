import { ShoppingCart } from 'lucide-react'

import { DEFAULT_MARKETPLACE } from '../marketplaces'
import { withTracking } from '../utils/tracking'

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center px-5 pt-7 pb-12 text-center text-gray-500">
        <div className="mb-4">
            <a
                href={withTracking(DEFAULT_MARKETPLACE.homepageUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-12 items-center justify-center rounded-xl bg-[#0f766e] text-white"
                aria-label="Cart Keeper"
            >
                <ShoppingCart size={26} strokeWidth={2.3} aria-hidden="true" />
            </a>
        </div>
        <p className="mb-1 text-sm font-medium">No saved products yet</p>
        <p className="text-xs">
            Open an integrated store product page, for now{' '}
            <a
                href={withTracking(DEFAULT_MARKETPLACE.homepageUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                {DEFAULT_MARKETPLACE.displayName}
            </a>{' '}
            and <br /> click “Save product” in the extension.
        </p>
    </div>
)
