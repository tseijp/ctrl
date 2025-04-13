# Figma クローンサービス実装タスク

## 1. プロジェクトセットアップ

- [x] HonoX プロジェクトの初期化
- [x] ディレクトリ構造の作成
     - [x] app/routes ディレクトリ作成
     - [x] app/islands ディレクトリ作成
     - [x] app/models ディレクトリ作成
     - [x] app/lib ディレクトリ作成
     - [x] app/api ディレクトリ作成
     - [x] app/db ディレクトリ作成
     - [x] app/auth ディレクトリ作成
     - [x] public ディレクトリ作成
- [x] 依存パッケージのインストール
     - [x] hono, honox
     - [x] @tsei/ctrl
     - [x] @hono/auth-js, @auth/core
     - [x] drizzle, drizzle-zod
     - [x] zod
     - [x] react
     - [x] tailwindcss
- [x] vite.config.ts の設定
- [x] tsconfig.json の設定
- [x] Tailwind CSS の設定

## 2. データベース設計と実装

- [ ] Cloudflare D1 データベースの作成
- [x] スキーマ定義ファイル (app/db/schema.ts) の作成
     - [x] subscriptions テーブル定義
     - [x] teams テーブル定義
     - [x] users テーブル定義
     - [x] projects テーブル定義
     - [x] layers テーブル定義
     - [x] threads テーブル定義
     - [x] chats テーブル定義
     - [x] nodes テーブル定義
     - [x] edges テーブル定義
- [x] マイグレーションファイルの作成
- [ ] データベース初期化スクリプトの作成
- [x] Drizzle ORM の設定

## 3. 認証システム実装

- [x] 認証設定ファイル (app/auth/config.ts) の作成
- [x] 認証ミドルウェア (app/auth/middleware.ts) の実装
- [x] ユーザー登録機能の実装（Google認証で実装）
- [x] ログイン機能の実装（Google認証で実装）
- [x] ログアウト機能の実装
- [x] ~~パスワードリセット機能の実装~~（Google認証のみなので不要）
- [x] ソーシャルログイン連携の実装（Google認証）
- [x] セッション管理の実装（JWTで実装）
- [ ] 権限管理 (admin/member) の実装

## 4. バックエンド機能実装

### 4.1 モデル実装

- [x] サブスクリプションモデル (app/models/subscription.ts) の実装
- [x] 組織モデル (app/models/team.ts) の実装
- [x] ユーザーモデル (app/models/user.ts) の実装
- [x] プロジェクトモデル (app/models/project.ts) の実装
- [x] レイヤーモデル (app/models/layer.ts) の実装
- [x] スレッドモデル (app/models/thread.ts) の実装
- [x] チャットモデル (app/models/chat.ts) の実装
- [x] ノードモデル (app/models/node.ts) の実装
- [x] エッジモデル (app/models/edge.ts) の実装

### 4.2 API 実装

- [x] 認証 API 実装
     - [x] POST /api/auth/register (Auth.jsで実装)
     - [x] POST /api/auth/login (Auth.jsで実装)
     - [x] POST /api/auth/logout (Auth.jsで実装)
     - [x] GET /api/auth/me
     - [x] PUT /api/auth/profile
- [x] 組織・サブスクリプション API 実装
     - [x] POST /api/teams
     - [x] GET /api/teams
     - [x] GET /api/teams/:id
     - [x] PUT /api/teams/:id
     - [x] POST /api/teams/:id/members
     - [x] DELETE /api/teams/:id/members/:userId
     - [x] GET /api/subscriptions/:id
     - [x] POST /api/subscriptions
     - [x] PUT /api/subscriptions/:id
- [x] プロジェクト API 実装
     - [x] POST /api/projects
     - [x] GET /api/projects
     - [x] GET /api/projects/:id
     - [x] PUT /api/projects/:id
     - [x] DELETE /api/projects/:id
     - [x] POST /api/projects/:id/layers
     - [x] GET /api/projects/:id/layers
- [x] UI 要素 API 実装
     - [x] POST /api/projects/:id/nodes
     - [x] GET /api/projects/:id/nodes
     - [x] GET /api/projects/:id/nodes/:nodeId
     - [x] PUT /api/projects/:id/nodes/:nodeId
     - [x] DELETE /api/projects/:id/nodes/:nodeId
     - [x] POST /api/projects/:id/edges
     - [x] GET /api/projects/:id/edges
     - [x] PUT /api/projects/:id/edges/:edgeId
- [x] LLM 対話 API 実装
     - [x] POST /api/projects/:id/threads
     - [x] GET /api/projects/:id/threads
     - [x] POST /api/threads/:id/chats
     - [x] GET /api/threads/:id/chats
     - [x] POST /api/threads/:id/generate
     - [x] POST /api/threads/:id/update

### 4.3 Stripe 連携

- [ ] Stripe API キーの設定
- [ ] サブスクリプション作成機能の実装
- [ ] 支払い処理の実装
- [ ] Webhook の実装
- [ ] 請求書発行機能の実装

## 5. フロントエンド実装

### 5.1 基本レイアウト

- [ ] レンダラー (app/routes/\_renderer.tsx) の実装
- [ ] エラーページ (app/routes/\_error.tsx) の実装
- [ ] 404 ページ (app/routes/\_404.tsx) の実装
- [ ] ミドルウェア (app/routes/\_middleware.ts) の実装
- [ ] クライアントエントリーファイル (app/client.ts) の実装

### 5.2 @tsei/ctrl 統合

- [ ] コントローラーコンポーネント (app/islands/controller.tsx) の実装
- [ ] UI コンポーネントの実装

### 5.3 ページ実装

- [x] トップページ (app/routes/index.tsx) の実装
- [x] 認証ページの実装
     - [ ] 登録ページ（Google認証のみなので不要）
     - [x] ログインページ（サインインページとして実装）
     - [ ] パスワードリセットページ（Google認証のみなので不要）
- [ ] ダッシュボードページの実装
- [ ] 組織管理ページの実装
- [ ] プロジェクト管理ページの実装
- [ ] エディタページの実装
     - [ ] レイヤーパネル
     - [ ] キャンバス
     - [ ] プロパティパネル
     - [ ] LLM チャットパネル

### 5.4 機能コンポーネント実装

- [ ] レイヤー管理コンポーネントの実装
- [ ] ノード編集コンポーネントの実装
- [ ] エッジ編集コンポーネントの実装
- [ ] LLM チャットインターフェースの実装
- [ ] プロジェクト共有コンポーネントの実装
- [ ] エクスポートコンポーネントの実装

## 6. 統合とテスト

- [ ] ユニットテストの作成と実行
- [ ] 統合テストの作成と実行
- [ ] E2E テストの作成と実行
- [ ] パフォーマンステストの実行
- [ ] セキュリティテストの実行
- [ ] クロスブラウザテストの実行

## 7. デプロイ

- [ ] Cloudflare Workers へのデプロイ設定
- [ ] Cloudflare D1 データベースのデプロイ
- [ ] CI/CD パイプラインの構築
- [ ] 本番環境の監視設定
- [ ] バックアップ戦略の実装
