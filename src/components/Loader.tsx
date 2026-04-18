export const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />

            <div className="w-full space-y-2">
                <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>

            <p className="mt-2 text-xs text-gray-400">Loading saved products...</p>
        </div>
    )
}
