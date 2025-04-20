# API ディレクトリをファイルベースルーティングに移行するための手順

## 概要

現在の実装では、API エンドポイントは `app/api` ディレクトリに配置され、`apiRouter.route` でマウントされています。この実装を HonoX のファイルベースルーティングに移行するための手順を以下に示します。

## 進捗状況

- [x]    1. ディレクトリ構造の準備
- [x]    2. ミドルウェアの設定
- [x] 3.1 auth API の移行
- [x] 3.2 projects API の移行
- [x] 3.3 subscriptions API の移行
- [x] 3.4 teams API の移行
- [x]    4. server.ts の修正
- [x]    5. 動作確認

## 手順

### 1. ディレクトリ構造の準備

```bash
# /api/auth ディレクトリに対応するルートディレクトリを作成
mkdir -p app/routes/api/auth

# /api/projects ディレクトリに対応するルートディレクトリを作成
mkdir -p app/routes/api/projects

# /api/subscriptions ディレクトリに対応するルートディレクトリを作成
mkdir -p app/routes/api/subscriptions

# /api/teams ディレクトリに対応するルートディレクトリを作成
mkdir -p app/routes/api/teams
```

### 2. ミドルウェアの設定

```bash
# API全体に適用するミドルウェアを作成
touch app/routes/api/_middleware.tsx

# 各APIグループに適用するミドルウェアを作成
touch app/routes/api/auth/_middleware.tsx
touch app/routes/api/projects/_middleware.tsx
touch app/routes/api/subscriptions/_middleware.tsx
touch app/routes/api/teams/_middleware.tsx
```

各ミドルウェアファイルには、そのパス以下のすべてのルートに適用するミドルウェアを設定します。例：

```typescript
// app/routes/api/_middleware.tsx
import { createRoute } from 'honox/factory'
import { requireAuth } from '../../auth/middleware'

// /api/* パス以下のすべてのルートに認証ミドルウェアを適用
export default createRoute(requireAuth)
```

### 3. 各 API エンドポイントの移行

#### 3.1 auth API の移行

```bash
# /me エンドポイントを移行
touch app/routes/api/auth/me.tsx

# /profile エンドポイントを移行
touch app/routes/api/auth/profile.tsx
```

各ファイルには、対応するエンドポイントの実装を移行します。例：

```typescript
// app/routes/api/auth/me.tsx
import { Hono } from 'hono'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// ユーザー情報取得API
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

app.get('/', async (c) => {
        const user = c.get('user')
        if (!user) {
                return c.json({ error: 'Unauthorized' }, 401)
        }

        return c.json({ user })
})

export default app
```

#### 3.2 projects API の移行

```bash
# プロジェクト一覧取得エンドポイントを移行
touch app/routes/api/projects/index.tsx

# プロジェクト詳細取得エンドポイントを移行
touch app/routes/api/projects/[id].tsx

# プロジェクト作成エンドポイントを移行
# (index.tsxにPOSTメソッドとして実装)

# プロジェクト更新エンドポイントを移行

# ([id].tsxにPUTメソッドとして実装)

# プロジェクト削除エンドポイントを移行
# ([id].tsxにDELETEメソッドとして実装)

# プロジェクトのレイヤー関連エンドポイントを移行
touch app/routes/api/projects/[id]/layers/index.tsx
touch app/routes/api/projects/[id]/layers/[layerId].tsx

# プロジェクトのノード関連エンドポイントを移行
touch app/routes/api/projects/[id]/nodes/index.tsx
touch app/routes/api/projects/[id]/nodes/[nodeId].tsx

# プロジェクトのエッジ関連エンドポイントを移行
touch app/routes/api/projects/[id]/edges/index.tsx
touch app/routes/api/projects/[id]/edges/[edgeId].tsx

# プロジェクトのスレッド関連エンドポイントを移行
touch app/routes/api/projects/[id]/threads/index.tsx
touch app/routes/api/projects/[id]/threads/[threadId].tsx
touch app/routes/api/projects/[id]/threads/[threadId]/chats/index.tsx
```

#### 3.3 subscriptions API の移行

```bash
# サブスクリプション一覧取得エンドポイントを移行
touch app/routes/api/subscriptions/index.tsx

# サブスクリプション詳細取得エンドポイントを移行
touch app/routes/api/subscriptions/[id].tsx

# サブスクリプション作成エンドポイントを移行
# (index.tsxにPOSTメソッドとして実装)

# サブスクリプション更新エンドポイントを移行
# ([id].tsxにPUTメソッドとして実装)
```

#### 3.4 teams API の移行

```bash
# チーム一覧取得エンドポイントを移行
touch app/routes/api/teams/index.tsx

# チーム詳細取得エンドポイントを移行
touch app/routes/api/teams/[id].tsx

# チーム作成エンドポイントを移行
# (index.tsxにPOSTメソッドとして実装)

# チーム更新エンドポイントを移行
# ([id].tsxにPUTメソッドとして実装)

# チームメンバー追加エンドポイントを移行
touch app/routes/api/teams/[id]/members/index.tsx

# チームメンバー削除エンドポイントを移行
touch app/routes/api/teams/[id]/members/[userId].tsx
```

### 4. server.ts の修正

`app/server.ts` ファイルから、以下の部分を削除または修正します：

```typescript
// 削除または修正する部分
import apiRouter from './api'

// ...

// 認証ハンドラーを設定
app.use('/api/auth/*', authMiddleware)
app.use('/api/*', requireAuth)

// APIルーターを登録
app.route('/api', apiRouter)
```

修正後の `app/server.ts` ファイルは以下のようになります：

```typescript
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { authConfig } from './auth/config'

const app = createApp({
        init(app) {
                // 認証設定を初期化
                app.use('*', authConfig)

                // 注: ファイルベースルーティングに移行したため、
                // 以前の認証ミドルウェアとAPIルーターの登録は削除しました
        },
})

showRoutes(app)

export default app
```

### 5. 動作確認

すべての API エンドポイントが正しく移行されたことを確認するために、以下のコマンドを実行してアプリケーションを起動し、各エンドポイントにリクエストを送信して動作を確認します：

```bash
npm run dev
```

## 注意点

- ファイルベースルーティングでは、ファイル名とディレクトリ構造が URL パスに対応します。
- `index.tsx` ファイルはそのディレクトリのルートパスに対応します。
- `[param].tsx` のような角括弧を含むファイル名は、動的パラメータに対応します。
- `_middleware.tsx` ファイルは、そのディレクトリ以下のすべてのルートに適用されるミドルウェアを定義します。
- 各ファイルでは、`createRoute` 関数または `Hono` インスタンスを使用してルートを定義します。
