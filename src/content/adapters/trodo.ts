import { getPageMarketplaceName, getPageMarketplaceUrl } from './marketplace'
import type { MarketplaceAdapter } from './types'

const isTrodoHost = () => {
    const hostnameParts = window.location.hostname.toLowerCase().split('.')
    const domain = hostnameParts.at(-2)

    return domain === 'trodo'
}

const getImageUrl = () => {
    const imageUrl = document.querySelector('.product-img-block img')?.getAttribute('src') ?? ''
    if (!imageUrl) return ''

    try {
        return new URL(imageUrl, window.location.href).toString()
    } catch {
        return imageUrl
    }
}

const isProductPage = () => {
    if (!isTrodoHost()) return false

    return Boolean(document.querySelector('.product-info h1'))
}

const parsePriceWithCurrency = (text: string) => {
    const cleaned = text.trim()
    const currencyMatch = cleaned.match(/[€$£]/)

    return {
        value: parseFloat(cleaned.replace(/[^\d.,]/g, '').replace(',', '.')),
        currency: currencyMatch ? currencyMatch[0] : '',
    }
}

const parseProduct = () => {
    if (!isTrodoHost()) return null

    try {
        const name = document.querySelector('.product-info h1')?.textContent?.trim() ?? ''
        const imageUrl = getImageUrl()
        const priceText = document.querySelector('.price-block .price')?.textContent ?? ''
        const { value: price, currency } = parsePriceWithCurrency(priceText)

        if (!name || !imageUrl || Number.isNaN(price)) {
            return null
        }

        return {
            marketplaceName: getPageMarketplaceName(),
            marketplaceUrl: getPageMarketplaceUrl(),
            name,
            imageUrl,
            price,
            currency,
            url: window.location.href,
        }
    } catch {
        return null
    }
}

export const trodoAdapter: MarketplaceAdapter = {
    isProductPage,
    parseProduct,
}
