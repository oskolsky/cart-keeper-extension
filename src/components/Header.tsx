type HeaderProps = {
    count: number
}

export const Header = ({ count }: HeaderProps) => {
    return (
        <div className="sticky top-0 z-20 bg-white px-5">
            <div className="flex items-center justify-between py-5">
                <div className="flex items-center gap-2">
                    <img src="/icons/128.png" alt="Cart Keeper" width={32} height={32} />
                    <span className="text-base font-bold text-gray-900">Cart Keeper</span>
                </div>

                <div className="flex items-center gap-2">
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
