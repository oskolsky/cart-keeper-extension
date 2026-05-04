import type { Product } from '../../types'
import { getPageMarketplaceName, getPageMarketplaceUrl } from './marketplace'

export type ParsedPrice = {
    currency: string
    value: number
}

const CURRENCY_CODES = [
    'USD',
    'EUR',
    'GBP',
    'RUB',
    'CAD',
    'AUD',
    'NZD',
    'PLN',
    'BRL',
    'JPY',
    'KRW',
    'CNY',
    'TRY',
    'UAH',
    'CHF',
    'NOK',
    'SEK',
    'DKK',
    'CZK',
    'HUF',
    'RON',
    'BGN',
    'MXN',
    'SGD',
    'HKD',
    'TWD',
    'THB',
    'IDR',
    'MYR',
    'PHP',
    'VND',
    'INR',
    'ILS',
    'CLP',
    'COP',
    'PEN',
    'ZAR',
]

const CURRENCY_SYMBOLS = [
    'R$',
    'CA$',
    'A$',
    'NZ$',
    'US$',
    'руб.',
    'руб',
    'р.',
    '₽',
    'zł',
    '$',
    '€',
    '£',
    '¥',
    '₹',
    '₩',
    '₺',
    '₴',
    '₫',
    '₪',
    '฿',
    '₱',
]

const PRICE_PATTERN = /\d+(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?/

export const normalizeText = (text: string) => {
    return text.replace(/\s+/g, ' ').trim()
}

export const matchesHostname = (domain: string) => {
    const hostname = window.location.hostname.toLowerCase()

    return hostname === domain || hostname.endsWith(`.${domain}`)
}

export const matchesSecondLevelDomain = (domain: string) => {
    const hostnameParts = window.location.hostname.toLowerCase().split('.')

    return hostnameParts.at(-2) === domain
}

export const getMetaContent = (selector: string) => {
    return document.querySelector<HTMLMetaElement>(selector)?.content?.trim() ?? ''
}

export const getCanonicalUrl = () => {
    return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href?.trim() || window.location.href
}

export const toAbsoluteUrl = (url: string, fallback = '') => {
    if (!url) return fallback

    try {
        return new URL(url, window.location.href).toString()
    } catch {
        return fallback
    }
}

export const readElementValue = (element: Element | null) => {
    if (!element) return ''
    if (element instanceof HTMLMetaElement) return element.content.trim()
    if (element instanceof HTMLImageElement) {
        return element.currentSrc || element.src || element.dataset.src || element.getAttribute('data-src') || ''
    }
    if (element instanceof HTMLAnchorElement) return element.href.trim()

    return (
        element.textContent?.trim() ||
        element.getAttribute('aria-label')?.trim() ||
        element.getAttribute('content')?.trim() ||
        ''
    )
}

export const getFirstElementValue = (selectors: string[], root: ParentNode = document) => {
    for (const selector of selectors) {
        const value = readElementValue(root.querySelector(selector))
        if (value) return value
    }

    return ''
}

export const getFirstParsedPrice = (
    selectors: string[],
    {
        limit = 40,
        root = document,
        priceOptions,
    }: {
        limit?: number
        priceOptions?: Parameters<typeof parsePriceText>[1]
        root?: ParentNode
    } = {},
) => {
    const priceElements = selectors.flatMap(selector => Array.from(root.querySelectorAll<HTMLElement>(selector)))

    for (const element of priceElements.slice(0, limit)) {
        const price = parsePriceText(readElementValue(element), priceOptions)
        if (price) return price
    }

    return null
}

export const parsePriceValue = (text: string) => {
    const priceMatch = normalizeText(text).match(PRICE_PATTERN)
    if (!priceMatch) return null

    const normalizedPrice = priceMatch[0].replace(/\s/g, '')
    const lastDotIndex = normalizedPrice.lastIndexOf('.')
    const lastCommaIndex = normalizedPrice.lastIndexOf(',')
    const separatorIndex = Math.max(lastDotIndex, lastCommaIndex)

    if (separatorIndex > -1 && normalizedPrice.length - separatorIndex - 1 === 3) {
        const value = Number(normalizedPrice.replace(/[.,]/g, ''))
        return Number.isNaN(value) ? null : value
    }

    const decimalSeparator = lastDotIndex > lastCommaIndex ? '.' : ','
    const value = Number(
        normalizedPrice
            .replace(new RegExp(`\\${decimalSeparator === '.' ? ',' : '.'}`, 'g'), '')
            .replace(decimalSeparator, '.'),
    )

    return Number.isNaN(value) ? null : value
}

export const parseCurrency = (text: string) => {
    const symbol = CURRENCY_SYMBOLS.find(currencySymbol => text.includes(currencySymbol))
    if (symbol) {
        return ['руб.', 'руб', 'р.', '₽'].includes(symbol) ? 'RUB' : symbol
    }

    return CURRENCY_CODES.find(currencyCode => new RegExp(`\\b${currencyCode}\\b`, 'i').test(text)) ?? ''
}

export const parsePriceText = (
    text: string,
    { allowFree = false, requireCurrency = true }: { allowFree?: boolean; requireCurrency?: boolean } = {},
): ParsedPrice | null => {
    const normalizedText = normalizeText(text)
    if (!normalizedText) return null

    if (allowFree && /free(?:\s+to\s+play)?|бесплатно|gratis/i.test(normalizedText)) {
        return {
            currency: '',
            value: 0,
        }
    }

    const currency = parseCurrency(normalizedText)
    if (requireCurrency && !currency) return null

    const value = parsePriceValue(normalizedText)
    if (value === null) return null

    return {
        currency,
        value,
    }
}

export const buildProduct = ({
    imageUrl,
    name,
    price,
    url = getCanonicalUrl(),
}: {
    imageUrl: string
    name: string
    price: ParsedPrice | null
    url?: string
}): Product | null => {
    if (!name || !imageUrl || !price) return null

    return {
        marketplaceName: getPageMarketplaceName(),
        marketplaceUrl: getPageMarketplaceUrl(),
        name,
        imageUrl,
        price: price.value,
        currency: price.currency,
        url: toAbsoluteUrl(url, window.location.href),
    }
}
