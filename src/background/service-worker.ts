type ProductStatusMessage = {
    type: 'PRODUCT_STATUS_CHANGED'
    canSave: boolean
}

type ProductStatusResponse = {
    success: boolean
}

const COLOR_ICON_PATHS = {
    16: 'icons/16.png',
    48: 'icons/48.png',
    128: 'icons/128.png',
}

const GRAY_ICON_PATHS = {
    16: 'icons/16-gray.png',
    48: 'icons/48-gray.png',
    128: 'icons/128-gray.png',
}

const setActionState = (tabId: number, canSave: boolean) => {
    chrome.action.setBadgeText({ tabId, text: '' })

    if (canSave) {
        chrome.action.setTitle({ tabId, title: 'Save product with Cart Keeper' })
        chrome.action.setIcon({ tabId, path: COLOR_ICON_PATHS })
        return
    }

    chrome.action.setTitle({ tabId, title: 'Open Cart Keeper' })
    chrome.action.setIcon({ tabId, path: GRAY_ICON_PATHS })
}

const requestProductStatus = (tabId: number) => {
    setActionState(tabId, false)

    chrome.tabs.sendMessage(tabId, { type: 'GET_PRODUCT_STATUS' }, {}, (response?: ProductStatusResponse) => {
        if (chrome.runtime.lastError) return
        setActionState(tabId, Boolean(response?.success))
    })
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.enable()
})

chrome.tabs.onActivated.addListener(({ tabId }) => {
    requestProductStatus(tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
        setActionState(tabId, false)
        return
    }

    if (changeInfo.status === 'complete') {
        requestProductStatus(tabId)
    }
})

chrome.runtime.onMessage.addListener((message: ProductStatusMessage, sender) => {
    if (message.type !== 'PRODUCT_STATUS_CHANGED' || !sender.tab?.id) return

    setActionState(sender.tab.id, message.canSave)
})
