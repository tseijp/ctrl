import build from '@hono/vite-build/cloudflare-workers'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import honox from 'honox/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode, command }) => {
        // 環境変数を明示的に読み込む
        const env = loadEnv(mode, process.cwd(), '')

        // 環境変数をプロセス環境変数として設定
        process.env = { ...process.env, ...env }
        if (mode === 'client') {
                return {
                        build: {
                                rollupOptions: {
                                        input: ['./app/client.ts'],
                                        output: {
                                                entryFileNames: 'static/client.js',
                                                chunkFileNames: 'static/assets/[name]-[hash].js',
                                                assetFileNames: 'static/assets/[name].[ext]',
                                        },
                                },
                                emptyOutDir: false,
                        },
                }
        } else {
                return {
                        ssr: {
                                external: ['react', 'react-dom'],
                        },
                        plugins: [honox(), build()],
                }
        }
})
