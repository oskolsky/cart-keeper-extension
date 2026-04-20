# Cart Keeper

A Chrome extension that lets you save products from online stores into one local list.

[![Main Screenshot](./public/screenshots/main.png)](./public/screenshots/main.png)

## Features

- Save products directly from schema.org product pages and supported store-specific product pages
- Detect strict generic product pages when schema.org is missing
- Store-specific fallback integration: Trodo
- View saved products in a clean popup UI
- Groups saved products by marketplace
- Displays product image, price, and last save date
- Stores data locally in the browser (no backend)
- Updates existing products instead of creating duplicates

---

## How It Works

Cart Keeper checks the active tab and enables the extension action when the current page looks like a product page.
When a product is saved, the extension stores the product name, image URL, price, currency, product URL, marketplace name,
marketplace URL, and last save date in `chrome.storage.local`.

Product detection has three layers:

1. **schema.org product data** — first, Cart Keeper looks for structured product data with an offer. This is the most reliable generic path because many stores expose `Product` and `Offer` data for search engines.
2. **Store-specific integrations** — if structured data is not available, Cart Keeper checks supported store adapters, such as Trodo, where the product layout is known.
3. **Generic product signals** — if there is no schema.org data or supported adapter, Cart Keeper looks for strong signals such as a product title, image, price, and buy/add-to-cart controls.

See the user-facing [How it works](./public/how-it-works.html) page for the short product explanation.

## Installation (Development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cart-keeper-extension.git
cd cart-keeper-extension
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

### 4. Load the extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder from the project directory

### 5. Usage

1. Open a product page.
2. Click the extension icon.
3. Press **Add** when Cart Keeper detects a product.
4. Press **Update** if the product is already saved and you want to refresh its data.
5. Use the popup list to open or remove saved products.

### 6. Tech Stack

1. React
2. TypeScript
3. Vite
4. Tailwind CSS
5. Chrome Extension Manifest V3

### 7. Marketplace integrations

Marketplace support is split into two layers:

1. Use the default schema.org adapter for stores that expose product data.
2. Add a content adapter in `src/content/adapters` when a store needs a dedicated fallback parser.
3. Register store-specific fallbacks after the schema.org adapter and before the generic adapter in `src/content/adapters/index.ts`.
4. Keep the generic adapter last because it is heuristic-based.

Adapters are responsible for detecting product pages and returning a normalized `Product`.

### 8. Privacy

This extension does not collect or transmit any user data.
All data is stored locally in the browser.

See [Privacy Policy](./privacy-policy.md) for more details.
