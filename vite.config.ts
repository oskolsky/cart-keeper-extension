import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                popup: 'index.html',
                content: 'src/content/content-script.ts',
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
})
