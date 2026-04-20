import { SaveProductButton } from './SaveProductButton'

type HeaderProps = {
    saveLabel: string
    savedProductsCount: number
    hasCurrentProduct: boolean
    onSaveProduct: () => void
}

const getSavedProductsLabel = (count: number) => {
    return count === 1 ? 'In your cart · 1 item' : `In your cart · ${count} items`
}

export const Header = ({ saveLabel, savedProductsCount, hasCurrentProduct, onSaveProduct }: HeaderProps) => {
    return (
        <div className="sticky top-0 z-20 bg-white px-5">
            <div className="flex items-center justify-between py-5">
                <div>
                    <div className="text-base leading-5 font-semibold text-gray-900">Cart Keeper</div>
                    <div className="text-[11px] leading-4 font-medium tracking-wide text-gray-400 uppercase">
                        {getSavedProductsLabel(savedProductsCount)}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <SaveProductButton label={saveLabel} isDisabled={!hasCurrentProduct} onClick={onSaveProduct} />
                </div>
            </div>

            <hr className="border-gray-300" />
        </div>
    )
}
