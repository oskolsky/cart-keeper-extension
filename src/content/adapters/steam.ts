import type { MarketplaceAdapter } from '../../types'
import {
    buildProduct,
    getCanonicalUrl,
    getFirstElementValue,
    getMetaContent,
    matchesHostname,
    parsePriceText,
    toAbsoluteUrl,
} from './helpers'

const NAME_SELECTORS = ['.apphub_AppName', '#appHubAppName']
const IMAGE_SELECTORS = ['meta[property="og:image"]', '.game_header_image_full', '.apphub_AppIcon img']
const PRICE_SELECTORS = ['.discount_final_price', '.game_purchase_price', '.discount_original_price']

const isSteamAppUrl = () => {
    return /^\/app\/\d+(?:\/|$)/i.test(window.location.pathname)
}

const cleanName = (name: string) => {
    return name.replace(/\s+on\s+Steam$/i, '').trim()
}

const getName = () => {
    return cleanName(
        getFirstElementValue(NAME_SELECTORS) || getMetaContent('meta[property="og:title"]') || document.title,
    )
}

const getImageUrl = () => {
    return toAbsoluteUrl(getFirstElementValue(IMAGE_SELECTORS))
}

const getPriceElementText = (container: ParentNode) => {
    return getFirstElementValue(PRICE_SELECTORS, container)
}

const getPriceFromPurchaseBlocks = () => {
    const purchaseBlocks = Array.from(document.querySelectorAll<HTMLElement>('.game_area_purchase_game'))

    for (const block of purchaseBlocks) {
        const price = parsePriceText(getPriceElementText(block), {
            allowFree: true,
            requireCurrency: false,
        })
        if (price) return price
    }

    return null
}

const getPrice = () => {
    return (
        getPriceFromPurchaseBlocks() ??
        parsePriceText(document.querySelector<HTMLElement>('#game_area_purchase')?.textContent ?? '', {
            allowFree: true,
            requireCurrency: false,
        })
    )
}

const isProductPage = () => {
    return matchesHostname('store.steampowered.com') && isSteamAppUrl() && Boolean(getName())
}

const parseProduct = () => {
    if (!isProductPage()) return null

    try {
        return buildProduct({
            name: getName(),
            imageUrl: getImageUrl(),
            price: getPrice(),
            url: getCanonicalUrl(),
        })
    } catch {
        return null
    }
}

export const steamAdapter: MarketplaceAdapter = {
    isProductPage,
    parseProduct,
}
