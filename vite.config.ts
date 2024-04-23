import path from 'path';
import { defineConfig } from 'vite';

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
                additionalData: `@import "./styles/devices.scss";`, // Import mixins globally
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
