import type { Product } from '../types'

type GetProductResponse =
    | {
          success: true
          product: Product
      }
    | {
          success: false
          product?: null
      }

export const getProductFromPage = async (): Promise<GetProductResponse | null> => {
    if (typeof chrome === 'undefined' || !chrome.tabs) return null

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab?.id || !tab.url) {
        return null
    }

    try {
        return await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_PRODUCT',
        })
    } catch {
        return null
    }
}
