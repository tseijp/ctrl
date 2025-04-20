import { swaggerUI } from '@hono/swagger-ui'
import { basicAuth } from 'hono/basic-auth'
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { authConfig } from './auth/config'
import { authMiddleware, requireAuth } from './auth/middleware'

const app = createApp({
        init(app) {
                // 認証設定を初期化
                app.use('*', authConfig)

                // 認証ハンドラーを設定
                app.use('/api/auth/*', authMiddleware)
        },
})

app.use(
        '/docs',
        basicAuth({
                username: 'username',
                password: 'password',
        })
)

app.get('/docs', swaggerUI({ url: '/docs' }))

showRoutes(app)

export default app
