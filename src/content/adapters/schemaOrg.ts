import type { Product } from '../../types'
import { getPageMarketplaceName, getPageMarketplaceUrl } from './marketplace'
import type { MarketplaceAdapter } from './types'

type JsonObject = Record<string, unknown>

const isObject = (value: unknown): value is JsonObject => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const toArray = <T>(value: T | T[] | undefined): T[] => {
    if (value === undefined) return []
    return Array.isArray(value) ? value : [value]
}

const getText = (value: unknown): string => {
    if (typeof value === 'string') return value.trim()
    if (typeof value === 'number') return String(value)
    if (isObject(value)) {
        return getText(value.url) || getText(value.contentUrl) || getText(value.name) || getText(value['@id'])
    }

    return ''
}

const getFirstText = (value: unknown): string => {
    return toArray(value).map(getText).find(Boolean) || ''
}

const getTypes = (node: JsonObject): string[] => {
    return toArray(node['@type']).map(type => getText(type).toLowerCase())
}

const isProduct = (node: JsonObject) => {
    return getTypes(node).some(type => type.endsWith('product'))
}

const isOffer = (node: JsonObject) => {
    return getTypes(node).some(type => type.endsWith('offer') || type.endsWith('aggregateoffer'))
}

const findJsonLdProducts = (value: unknown): JsonObject[] => {
    const products: JsonObject[] = []

    const visit = (node: unknown) => {
        if (Array.isArray(node)) {
            node.forEach(visit)
            return
        }

        if (!isObject(node)) return

        if (isProduct(node) && toArray(node.offers).some(offer => isObject(offer) && isOffer(offer))) {
            products.push(node)
        }

        Object.values(node).forEach(visit)
    }

    visit(value)
    return products
}

const parseJsonLd = () => {
    return Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'))
        .map(script => {
            try {
                return JSON.parse(script.textContent || '')
            } catch {
                return null
            }
        })
        .filter(Boolean)
}

const parsePrice = (value: unknown) => {
    const text = getText(value)
    const price = parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'))
    return Number.isNaN(price) ? null : price
}

const getPrimaryOffer = (product: JsonObject) => {
    return toArray(product.offers).find((offer): offer is JsonObject => isObject(offer) && isOffer(offer)) ?? null
}

const getProductUrl = (product: JsonObject) => {
    const url = getText(product.url) || window.location.href

    try {
        return new URL(url, window.location.href).toString()
    } catch {
        return window.location.href
    }
}

const getImageUrl = (product: JsonObject) => {
    const imageUrl =
        getFirstText(product.image) ||
        document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content?.trim() ||
        ''

    if (!imageUrl) return ''

    try {
        return new URL(imageUrl, window.location.href).toString()
    } catch {
        return imageUrl
    }
}

const readElementValue = (element: Element | null) => {
    if (!element) return ''
    if (element instanceof HTMLMetaElement) return element.content.trim()
    if (element instanceof HTMLImageElement) return element.src.trim()
    if (element instanceof HTMLAnchorElement) return element.href.trim()
    return element.textContent?.trim() || ''
}

const findMicrodataProduct = () => {
    return (
        Array.from(document.querySelectorAll<HTMLElement>('[itemtype]')).find(element => {
            return element.itemType.toString().toLowerCase().includes('schema.org/product')
        }) ?? null
    )
}

const findMicrodataOffer = (productElement: HTMLElement) => {
    return (
        Array.from(productElement.querySelectorAll<HTMLElement>('[itemtype], [itemprop="offers"]')).find(element => {
            const itemType = element.itemType.toString().toLowerCase()
            return itemType.includes('schema.org/offer') || element.getAttribute('itemprop') === 'offers'
        }) ?? null
    )
}

const hasMicrodataProductOffer = () => {
    const product = findMicrodataProduct()
    return Boolean(product && findMicrodataOffer(product))
}

const parseMicrodataProduct = (): Product | null => {
    const productElement = findMicrodataProduct()
    if (!productElement) return null

    const offerElement = findMicrodataOffer(productElement)
    if (!offerElement) return null

    const name = readElementValue(productElement.querySelector('[itemprop="name"]'))
    const imageUrl = readElementValue(productElement.querySelector('[itemprop="image"]'))
    const price = parsePrice(readElementValue(offerElement.querySelector('[itemprop="price"]')))
    const currency = readElementValue(offerElement.querySelector('[itemprop="priceCurrency"]'))
    const productUrl = readElementValue(productElement.querySelector('[itemprop="url"]')) || window.location.href

    if (!name || price === null || !imageUrl) return null

    return {
        marketplaceName: getPageMarketplaceName(),
        marketplaceUrl: getPageMarketplaceUrl(),
        name,
        imageUrl,
        price,
        currency,
        url: getProductUrl({ url: productUrl }),
    }
}

const hasSchemaOrgProductOffer = () => {
    return parseJsonLd().some(item => findJsonLdProducts(item).length > 0) || hasMicrodataProductOffer()
}

const parseProduct = (): Product | null => {
    try {
        const product = parseJsonLd().flatMap(findJsonLdProducts)[0]
        if (!product) return parseMicrodataProduct()

        const offer = getPrimaryOffer(product)
        if (!offer) return null

        const price = parsePrice(offer.price ?? offer.lowPrice ?? offer.highPrice)
        const name = getText(product.name)
        const imageUrl = getImageUrl(product)
        const currency = getText(offer.priceCurrency)

        if (!name || price === null || !imageUrl) return null

        return {
            marketplaceName: getPageMarketplaceName(),
            marketplaceUrl: getPageMarketplaceUrl(),
            name,
            imageUrl,
            price,
            currency,
            url: getProductUrl(product),
        }
    } catch {
        return null
    }
}

export const schemaOrgAdapter: MarketplaceAdapter = {
    isProductPage: hasSchemaOrgProductOffer,
    parseProduct,
}
