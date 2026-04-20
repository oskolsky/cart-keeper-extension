# Cart Keeper

A Chrome extension that lets you save products from integrated stores into one local list.

[![Main Screenshot](./public/screenshots/main.png)](./public/screenshots/main.png)

## Features

- Save products directly from schema.org product pages and supported store-specific product pages
- Detect strict generic product pages when schema.org is missing
- Store-specific fallback integration: Trodo.com
- View saved products in a clean popup UI
- Groups saved products by marketplace
- Displays product image, price, and last save date
- Stores data locally in the browser (no backend)
- Prevents duplicate entries

---

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

1. Open any product page with schema.org product data, strong product-page signals, or a supported store-specific integration
2. Click the extension icon
3. Save the product
4. Open the extension popup to manage saved products

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
