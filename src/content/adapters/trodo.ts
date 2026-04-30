import type { MarketplaceAdapter } from '../../types'
import { buildProduct, matchesSecondLevelDomain, parsePriceText, toAbsoluteUrl } from './helpers'

const NAME_SELECTOR = '.product-info h1'
const IMAGE_SELECTOR = '.product-img-block img'
const PRICE_SELECTOR = '.price-block .price'

const getImageUrl = () => {
    return toAbsoluteUrl(document.querySelector(IMAGE_SELECTOR)?.getAttribute('src') ?? '')
}

const isProductPage = () => {
    if (!matchesSecondLevelDomain('trodo')) return false

    return Boolean(document.querySelector(NAME_SELECTOR))
}

const parseProduct = () => {
    if (!matchesSecondLevelDomain('trodo')) return null

    try {
        return buildProduct({
            name: document.querySelector(NAME_SELECTOR)?.textContent?.trim() ?? '',
            imageUrl: getImageUrl(),
            price: parsePriceText(document.querySelector(PRICE_SELECTOR)?.textContent ?? '', {
                requireCurrency: false,
            }),
            url: window.location.href,
        })
    } catch {
        return null
    }
}

export const trodoAdapter: MarketplaceAdapter = {
    isProductPage,
    parseProduct,
}
