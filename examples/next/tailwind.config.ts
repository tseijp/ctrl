import type { Config } from 'tailwindcss'

export default {
        content: [
                './pages/**/*.{js,ts,jsx,tsx,mdx}',
                './components/**/*.{js,ts,jsx,tsx,mdx}',
                './app/**/*.{js,ts,jsx,tsx,mdx}',
                // my created
                '../../node_modules/@tsei/ctrl/**/*.{ts,tsx}',
                '../docs/src/**/*.{ts,tsx}',
        ],
        theme: {
                extend: {},
        },
        plugins: [],
} satisfies Config
