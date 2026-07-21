import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: false,
        proxy: {
            // Forward to backend when mocks are off
            '/api': {
                target: process.env.VITE_API_URL ?? 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    define: {
        // Expose env vars to the client
        'import.meta.env.VITE_USE_MOCKS': JSON.stringify(process.env.VITE_USE_MOCKS ?? 'true'),
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL ?? 'http://localhost:8080/api'),
    },
});
