import type { MarketplaceAdapter } from './types'

const getMarketplaceName = () => {
    return window.location.hostname.replace(/^www\./, '')
}

const getMarketplaceUrl = () => {
    return window.location.origin
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
    try {
        const name = document.querySelector('.product-info h1')?.textContent?.trim() ?? ''
        const imageUrl = getImageUrl()
        const priceText = document.querySelector('.price-block .price')?.textContent ?? ''
        const { value: price, currency } = parsePriceWithCurrency(priceText)

        if (!name || !imageUrl || Number.isNaN(price)) {
            return null
        }

        const marketplaceName = getMarketplaceName()

        return {
            marketplaceName,
            marketplaceUrl: getMarketplaceUrl(),
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
