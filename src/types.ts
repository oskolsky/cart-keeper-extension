export type Product = {
    marketplaceName: string
    marketplaceUrl: string
    name: string
    imageUrl: string
    price: number
    currency: string
    url: string
}

export type SavedProduct = Product & {
    savedAt: string
}
