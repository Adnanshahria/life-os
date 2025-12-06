import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        { enforce: 'pre', ...mdx() },
        react()
    ],
    base: './', // Ensure relative paths for deployment
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
})
