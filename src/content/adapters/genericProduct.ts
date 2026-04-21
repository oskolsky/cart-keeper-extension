import type { Product } from '../../types'
import { getPageMarketplaceName, getPageMarketplaceUrl } from './marketplace'
import type { MarketplaceAdapter } from './types'

type PriceResult = {
    currency: string
    value: number
}

type ProductCandidate = Product & {
    score: number
}

const BUY_BUTTON_TEXTS = [
    'add to cart',
    'add to basket',
    'buy now',
    'buy',
    'checkout',
    'в корзину',
    'добавить в корзину',
    'купить',
    'pirkt',
    'pievienot grozam',
    'osta',
    'lisa ostukorvi',
    'in den warenkorb',
    'kaufen',
    'ajouter au panier',
]

const PRICE_SELECTORS = [
    '[class*="price" i]',
    '[id*="price" i]',
    '[data-testid*="price" i]',
    '[data-test*="price" i]',
    '[aria-label*="price" i]',
]

const IMAGE_SELECTORS = [
    'main img',
    '[role="main"] img',
    'section[aria-label*="image" i] img',
    'img[aria-label*="goods image" i]',
    'img[class*="product" i]',
    'img[class*="part" i]',
    'img[class*="listing-inline-image" i]',
    'img[id*="inlineimg" i]',
]

const CURRENCY_BY_SYMBOL: Record<string, string> = {
    $: '$',
    '€': '€',
    '£': '£',
}

const CURRENCY_CODES = ['EUR', 'USD', 'GBP']

const parsePriceValue = (text: string) => {
    const normalizedText = text.replace(/\s/g, '')
    const lastDotIndex = normalizedText.lastIndexOf('.')
    const lastCommaIndex = normalizedText.lastIndexOf(',')
    const separatorIndex = Math.max(lastDotIndex, lastCommaIndex)

    if (separatorIndex > -1 && normalizedText.length - separatorIndex - 1 === 3) {
        const thousandsNormalizedPrice = normalizedText.replace(/[.,]/g, '')
        const value = Number(thousandsNormalizedPrice)

        return Number.isNaN(value) ? null : value
    }

    const decimalSeparator = lastDotIndex > lastCommaIndex ? '.' : ','
    const normalizedPrice = normalizedText
        .replace(new RegExp(`\\${decimalSeparator === '.' ? ',' : '.'}`, 'g'), '')
        .replace(decimalSeparator, '.')
    const value = Number(normalizedPrice)

    return Number.isNaN(value) ? null : value
}

const getMetaContent = (selector: string) => {
    return document.querySelector<HTMLMetaElement>(selector)?.content?.trim() ?? ''
}

const getCanonicalUrl = () => {
    return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href?.trim() || window.location.href
}

const toAbsoluteUrl = (url: string) => {
    if (!url) return ''

    try {
        return new URL(url, window.location.href).toString()
    } catch {
        return ''
    }
}

const cleanProductName = (name: string) => {
    return name.replace(/^more information for\s+/i, '').trim()
}

const getImageSource = (image: HTMLImageElement) => {
    const loadedUrl = image.currentSrc || image.src
    if (loadedUrl && !loadedUrl.startsWith('data:image')) return loadedUrl

    return image.dataset.src || loadedUrl
}

const getProductName = () => {
    const name =
        document.querySelector<HTMLHeadingElement>('main h1')?.textContent?.trim() ||
        document.querySelector<HTMLHeadingElement>('h1')?.textContent?.trim() ||
        document
            .querySelector<HTMLElement>('section[aria-label*="more information for" i]')
            ?.getAttribute('aria-label')
            ?.trim() ||
        getMetaContent('meta[property="og:title"]') ||
        getMetaContent('meta[name="twitter:title"]') ||
        document.title.trim()

    return cleanProductName(name)
}

const isLikelyProductImage = (image: HTMLImageElement, area: number) => {
    const src = getImageSource(image)
    const alt = image.alt.toLowerCase()
    const ariaLabel = image.getAttribute('aria-label')?.toLowerCase() ?? ''
    const className = image.className.toString().toLowerCase()
    const id = image.id.toLowerCase()
    const hasProductImageHint =
        ariaLabel.includes('goods image') ||
        className.includes('product') ||
        className.includes('part') ||
        className.includes('listing-inline-image') ||
        id.includes('inlineimg') ||
        src.includes('/product/') ||
        src.includes('/info/')

    return (
        src &&
        !src.endsWith('.svg') &&
        !src.includes('transpurple') &&
        !src.includes('clear') &&
        !src.includes('logo') &&
        !src.includes('arrow') &&
        !alt.includes('logo') &&
        !src.startsWith('data:image') &&
        (area >= 10000 || hasProductImageHint)
    )
}

const getProductImageUrl = () => {
    const metaImageUrl = getMetaContent('meta[property="og:image"]') || getMetaContent('meta[name="twitter:image"]')
    if (metaImageUrl) return toAbsoluteUrl(metaImageUrl)

    const images = IMAGE_SELECTORS.flatMap(selector =>
        Array.from(document.querySelectorAll<HTMLImageElement>(selector)),
    )
        .map(image => ({
            image,
            area:
                (image.naturalWidth || image.width || image.clientWidth) *
                (image.naturalHeight || image.height || image.clientHeight),
        }))
        .filter(({ image, area }) => isLikelyProductImage(image, area))
        .sort((first, second) => second.area - first.area)

    return toAbsoluteUrl(images[0] ? getImageSource(images[0].image) : '')
}

const parsePrice = (text: string): PriceResult | null => {
    const normalizedText = text.replace(/\s+/g, ' ').trim()
    const symbol = Object.keys(CURRENCY_BY_SYMBOL).find(currentSymbol => normalizedText.includes(currentSymbol))
    const code = CURRENCY_CODES.find(currentCode => new RegExp(`\\b${currentCode}\\b`, 'i').test(normalizedText))
    const priceMatch = normalizedText.match(
        /(?:[$€£]\s*)?(\d{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{2})|\d+(?:[.,]\d{2})?)(?:\s*(?:EUR|USD|GBP))?/i,
    )

    if (!priceMatch || (!symbol && !code)) return null

    const value = parsePriceValue(priceMatch[1])
    if (value === null) return null

    return {
        currency: symbol ? CURRENCY_BY_SYMBOL[symbol] : code || '',
        value,
    }
}

const getPriceFromMeta = () => {
    const priceText =
        getMetaContent('meta[property="product:price:amount"]') ||
        getMetaContent('meta[property="og:price:amount"]') ||
        getMetaContent('meta[name="twitter:data1"]')
    const currency =
        getMetaContent('meta[property="product:price:currency"]') ||
        getMetaContent('meta[property="og:price:currency"]')

    if (!priceText) return null

    const price = parsePriceValue(priceText)
    if (price === null) return null

    return {
        currency,
        value: price,
    }
}

const getPriceFromDom = () => {
    const priceElements = PRICE_SELECTORS.flatMap(selector =>
        Array.from(document.querySelectorAll<HTMLElement>(selector)),
    )

    for (const element of priceElements.slice(0, 40)) {
        const price = parsePrice(element.textContent ?? element.getAttribute('aria-label') ?? '')
        if (price) return price
    }

    return null
}

const hasBuyButton = () => {
    const actions = Array.from(
        document.querySelectorAll<HTMLButtonElement | HTMLAnchorElement | HTMLInputElement>(
            'button, [role="button"], input[type="submit"]',
        ),
    )

    return actions.some(action => {
        const text = (action.textContent || action.getAttribute('value') || action.getAttribute('aria-label') || '')
            .trim()
            .toLowerCase()
        return BUY_BUTTON_TEXTS.some(buyText => text.includes(buyText))
    })
}

const hasProductUrlPattern = () => {
    return (
        /\/(product|products|p|item|dp|sku)\//i.test(window.location.pathname) ||
        /-g-\d+\.html$/i.test(window.location.pathname) ||
        new URLSearchParams(window.location.search).has('goods_id')
    )
}

const buildProductCandidate = (): ProductCandidate | null => {
    if (!hasBuyButton()) return null

    const name = getProductName()
    const imageUrl = getProductImageUrl()
    const price = getPriceFromMeta() ?? getPriceFromDom()

    if (!name || !imageUrl || !price?.currency) return null

    const score =
        20 +
        20 +
        30 +
        10 +
        30 +
        (document.querySelector('link[rel="canonical"]') ? 5 : 0) +
        (document.querySelectorAll('h1').length === 1 ? 5 : 0) +
        (hasProductUrlPattern() ? 10 : 0)

    if (score < 75) return null

    return {
        marketplaceName: getPageMarketplaceName(),
        marketplaceUrl: getPageMarketplaceUrl(),
        name,
        imageUrl,
        price: price.value,
        currency: price.currency,
        url: toAbsoluteUrl(getCanonicalUrl()),
        score,
    }
}

const isProductPage = () => {
    return Boolean(buildProductCandidate())
}

const parseProduct = (): Product | null => {
    const candidate = buildProductCandidate()
    if (!candidate) return null

    const { score: _score, ...product } = candidate
    return product
}

export const genericProductAdapter: MarketplaceAdapter = {
    isProductPage,
    parseProduct,
}
