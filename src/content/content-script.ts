import { parseProductFromAdapters } from './adapters'

const getCanSaveProduct = () => {
    return Boolean(parseProductFromAdapters())
}

const notifyProductStatus = () => {
    try {
        chrome.runtime.sendMessage({
            type: 'PRODUCT_STATUS_CHANGED',
            canSave: getCanSaveProduct(),
        })
    } catch {
        // Extension was reloaded while this page still had the old content script.
    }
}

const debounce = <Callback extends () => void>(callback: Callback, timeout = 300) => {
    let timer: number | undefined

    return () => {
        window.clearTimeout(timer)
        timer = window.setTimeout(callback, timeout)
    }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_PRODUCT_STATUS') {
        sendResponse({ success: getCanSaveProduct() })
        return
    }

    if (message.type === 'GET_PRODUCT') {
        const product = parseProductFromAdapters()

        sendResponse({
            success: Boolean(product),
            product,
        })
    }
})

notifyProductStatus()

const notifyProductStatusAfterDomChange = debounce(notifyProductStatus)

new MutationObserver(notifyProductStatusAfterDomChange).observe(document.documentElement, {
    childList: true,
    subtree: true,
})
