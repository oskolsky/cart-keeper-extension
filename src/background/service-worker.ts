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

const ignoreChromeError = () => {
    chrome.runtime.lastError
}

const setActionState = (tabId: number, canSave: boolean) => {
    chrome.action.setBadgeText({ tabId, text: '' }, ignoreChromeError)

    if (canSave) {
        chrome.action.setTitle({ tabId, title: 'Save product with Cart Keeper' }, ignoreChromeError)
        chrome.action.setIcon({ tabId, path: COLOR_ICON_PATHS }, ignoreChromeError)
        return
    }

    chrome.action.setTitle({ tabId, title: 'Open Cart Keeper' }, ignoreChromeError)
    chrome.action.setIcon({ tabId, path: GRAY_ICON_PATHS }, ignoreChromeError)
}

const requestProductStatus = (tabId: number) => {
    setActionState(tabId, false)

    chrome.tabs.get(tabId, tab => {
        if (chrome.runtime.lastError) return
        if (!tab.id || tab.status !== 'complete') return

        chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_STATUS' }, {}, (response?: ProductStatusResponse) => {
            if (chrome.runtime.lastError) return
            setActionState(tab.id!, Boolean(response?.success))
        })
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
