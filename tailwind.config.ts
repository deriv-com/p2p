/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    plugins: [],
    theme: {
        extend: {},
        screens: {
            lg: '1280px',
            md: '768px',
        },
    },
};
