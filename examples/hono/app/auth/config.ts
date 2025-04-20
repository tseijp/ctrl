import { initAuthConfig } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import { z } from 'zod'

// 環境変数のスキーマ
const authEnvSchema = z.object({
        AUTH_SECRET: z.string().min(1),
        // AUTH_URL: z.string().url(),
        GOOGLE_ID: z.string().min(1),
        GOOGLE_SECRET: z.string().min(1),
})

// 認証設定を初期化する関数
export const authConfig = initAuthConfig((c) => {
        const env = {
                AUTH_SECRET: c.env.AUTH_SECRET || process.env.AUTH_SECRET,
                // AUTH_URL: c.env.AUTH_URL || process.env.AUTH_URL,
                GOOGLE_ID: c.env.GOOGLE_ID || process.env.GOOGLE_ID,
                GOOGLE_SECRET: c.env.GOOGLE_SECRET || process.env.GOOGLE_SECRET,
        }

        try {
                authEnvSchema.parse(env)
        } catch (error) {
                console.error('認証環境変数が不足しています:', error)
        }

        return {
                basePath: '/api/auth',
                secret: env.AUTH_SECRET,
                providers: [
                        Google({
                                clientId: env.GOOGLE_ID,
                                clientSecret: env.GOOGLE_SECRET,
                        }),
                ],
                session: {
                        strategy: 'jwt',
                        maxAge: 30 * 24 * 60 * 60, // 30日
                },
                pages: {
                        signIn: '/admin',
                },
                callbacks: {
                        async session({ session, token }) {
                                // セッションにユーザーIDを追加
                                if (session.user) {
                                        session.user.id = token.id as string
                                }
                                return session
                        },
                        async jwt({ token, user }) {
                                // JWTトークンにユーザーIDを追加
                                if (user) {
                                        token.id = user.id
                                }
                                return token
                        },
                },
        }
})
