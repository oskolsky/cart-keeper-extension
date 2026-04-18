import { getActiveAdapter } from './adapters'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_PRODUCT') {
        const adapter = getActiveAdapter()

        if (!adapter) {
            sendResponse({ success: false })
            return
        }

        const product = adapter.parseProduct()

        sendResponse({
            success: Boolean(product),
            product,
        })
    }
})
