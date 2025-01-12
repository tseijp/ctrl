/** @type {import('tailwindcss').Config} */
export default {
        content: [
                './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
                // my created
                '../../node_modules/@tsei/ctrl/**/*.{ts,tsx}',
        ],
        theme: {
                extend: {},
        },
        plugins: [],
}
