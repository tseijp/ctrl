import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { authConfig } from './auth/config'
import { authMiddleware } from './auth/middleware'
import apiRouter from './api'

const app = createApp({
  init(app) {
    // 認証設定を初期化
    app.use('*', authConfig)
    
    // 認証ハンドラーを設定
    app.use('/api/auth/*', authMiddleware)
    
    // APIルーターを登録
    app.route('/api', apiRouter)
  }
})

showRoutes(app)

export default app
