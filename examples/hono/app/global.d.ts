// global.d.ts
import '@hono/react-renderer'

declare module '@hono/react-renderer' {
        interface Props {
                title?: string
        }
}

declare module 'hono' {
        interface Env {
                Variables: {
                        user: User
                }
                Bindings: Env
        }
}

// Cloudflare D1の型定義
type D1Database = import('@cloudflare/workers-types').D1Database

// アプリケーション全体で使用する環境変数の型
export type Env = {
        DB: D1Database
        // Stripe関連の環境変数
        STRIPE_SECRET_KEY: string
        STRIPE_WEBHOOK_SECRET: string
        // 他の環境変数やバインディングをここに追加
}
