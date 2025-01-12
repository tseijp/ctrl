import type { Config } from 'tailwindcss'

export default {
        content: [
                './pages/**/*.{js,ts,jsx,tsx,mdx}',
                './components/**/*.{js,ts,jsx,tsx,mdx}',
                './app/**/*.{js,ts,jsx,tsx,mdx}',
                // my created
                '../../node_modules/@tsei/ctrl/**/*.{ts,tsx}',
        ],
        theme: {
                extend: {
                        colors: {
                                background: 'var(--background)',
                                foreground: 'var(--foreground)',
                        },
                },
        },
        plugins: [],
} satisfies Config
