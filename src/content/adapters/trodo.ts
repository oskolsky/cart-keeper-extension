import type { MarketplaceAdapter } from './types'

const TRODO_MARKETPLACE = {
    id: 'trodo',
    displayName: 'Trodo.com',
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
        const imageUrl = document.querySelector('.product-img-block img')?.getAttribute('src') ?? ''
        const priceText = document.querySelector('.price-block .price')?.textContent ?? ''
        const { value: price, currency } = parsePriceWithCurrency(priceText)
        const oldPriceText = document.querySelector('.price-block .old-price')?.textContent ?? ''
        const oldPrice = oldPriceText ? parsePriceWithCurrency(oldPriceText).value : undefined
        const discountPercent = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined
        const productIdText = document.querySelector('.product-id span')?.textContent ?? ''
        const productId = productIdText.replace('ID:', '').trim() || window.location.pathname

        if (!name || Number.isNaN(price)) {
            return null
        }

        return {
            id: `${TRODO_MARKETPLACE.id}:${productId}`,
            productId,
            marketplaceId: TRODO_MARKETPLACE.id,
            marketplaceName: TRODO_MARKETPLACE.displayName,
            category: TRODO_MARKETPLACE.displayName,
            name,
            imageUrl,
            price,
            oldPrice,
            discountPercent,
            currency,
            url: window.location.href,
        }
    } catch {
        return null
    }
}

export const trodoAdapter: MarketplaceAdapter = {
    ...TRODO_MARKETPLACE,
    isProductPage,
    parseProduct,
}
