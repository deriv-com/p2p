import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import htmlPlugin from 'vite-plugin-html-config';
import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: 'assets/[name].[hash].[ext]',
                    chunkFileNames: 'assets/[name].[hash].js',
                    entryFileNames: 'assets/[name].[hash].js',
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
                    additionalData: `@use "sass:color"; @use "styles/global_styles.scss" as *;`,
                    includePaths: [path.resolve(__dirname, './'), path.resolve(__dirname, './styles')],
                },
            },
        },
        define: {
            'process.env': env,
        },
        envPrefix: 'VITE_',
        plugins: [
            react(),
            svgr(),
            htmlPlugin({
                metas: [
                    {
                        content: process.env.VITE_APP_VERSION || '',
                        name: 'version',
                    },
                ],
            }),
        ],
        publicDir: 'public',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                styles: path.resolve(__dirname, './styles'),
            },
        },
    };
});
