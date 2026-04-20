import { ShoppingBasketIcon } from 'lucide-react'

type SaveProductButtonProps = {
    label: string
    isDisabled: boolean
    onClick: () => void
}

export const SaveProductButton = ({ label, isDisabled, onClick }: SaveProductButtonProps) => {
    return (
        <button
            type="button"
            className="flex h-9 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#0f766e] p-3 font-semibold text-white hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
            disabled={isDisabled}
            onClick={onClick}
        >
            <ShoppingBasketIcon size={20} />
            {label}
        </button>
    )
}
