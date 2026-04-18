export type SavedProduct = {
    id: string
    productId: string
    marketplaceId: string
    marketplaceName: string
    category?: string
    name: string
    imageUrl: string
    price: number
    oldPrice?: number
    discountPercent?: number
    currency: string
    url: string
}
