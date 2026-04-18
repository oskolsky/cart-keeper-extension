type SaveProductButtonProps = {
    isDisabled?: boolean
    onClick: () => void
}

export const SaveProductButton = ({ isDisabled, onClick }: SaveProductButtonProps) => {
    return (
        <div className="p-5">
            <button
                type="button"
                onClick={onClick}
                disabled={isDisabled}
                className="h-12 w-full cursor-pointer rounded-lg bg-[#0f766e] text-sm font-medium text-white hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                Save product
            </button>
        </div>
    )
}
