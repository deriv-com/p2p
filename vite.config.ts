import path from 'path';
import { defineConfig } from 'vite';
import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'deriv-com': ['@deriv-com/api-hooks', '@deriv-com/utils'],
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./styles/devices.scss"; @import "./styles/modals.scss";`, // Import mixins globally
            },
        },
    },
    plugins: [react(), svgr()],
    publicDir: 'public',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
