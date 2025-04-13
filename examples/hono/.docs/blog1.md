hono/auth-js と Cloudflare D1/drizzle で ユーザーのサインアップを実装する
Hono
Cloudflare
📄Arrow icon of a page link
hono/auth-js を使って Hono/Cloudflare pages で Google認証する
 の続きです。


前回で、Auth.js を使ってGoogle 認証を実装することはできましたが、ユーザー情報は Cookie にしか持っておらず、データベースへの保存ができていませんでした。


今回は、Cloudflare D1 と drizzle を使って、Auth.js でサインアップしたユーザーの情報をデータベースに保存するところを実装してみます。

事前準備
📄Arrow icon of a page link
hono/auth-js を使って Hono/Cloudflare pages で Google認証する
 を前提にします。


Cloudflare D1 のデータベースを作成しておきます。

Copy
pnpm wrangler d1 create my-app-database

作成した D1データベースの情報は wrangler.toml に記載しておきます

Copy
[[d1_databases]]
binding = "DB"
database_name = "my-app-database"
database_id = "my-app-database-id"
方針
Auth.js では、必要なテーブルを作成し、ORM や DB にあった adapter を使用することによって簡単にデータベースへのユーザー情報の保存が実装できます。

今回は Cloudflare D1 を使いたいため、相性の良い drizzle を ORM として使います。


基本的に、こちらを元に進めていきます。


また、今回はユーザー情報のデータベースへの保存を目的にするため、セッションに関してはデータベースで管理せず、JWTで管理します。

パッケージインストール
まずは drizzle 関連のパッケージをインストールします。

Copy
pnpm add drizzle-orm @auth/drizzle-adapter
pnpm add drizzle-kit --save-dev
テーブル作成
次に、Auth.js でのユーザー情報の保存に必要なテーブルを作成します。

今回は、セッションはデータベースを使わないため、user と account テーブルのみを作成します。


まずは drizzle.config.ts を作成します。

今回は src/db/schema.ts にスキーマを定義し、drizzle をマイグレーションファイルを置くディレクトリとして指定します。

Cloudflare D1 は SQLite ベースなので、dialect は sqlite にします。

Copy
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
} satisfies Config;
drizzle.config.ts

マイグレーションファイルの場所は、wrangler.toml にも記載します。

Copy
[[d1_databases]]
binding = "DB"
database_name = "my-app-database"
database_id = "my-app-database-id"
migrations_dir = "drizzle"
wrangler.toml

src/db/schema.ts にスキーマを定義していきます。

Copy
import type { AdapterAccountType } from '@auth/core/adapters';
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "user",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text(),
    email: text().unique(),
    emailVerified: integer({ mode: "timestamp_ms" }),
    image: text(),
  },
  () => []
)

export const accounts = sqliteTable(
  "account",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)
src/db/schema.ts

package.json にマイグレーション用のコマンドを登録します。

Copy
{
  "scripts": {
	  // ... 略
    "generate": "drizzle-kit generate",
    "local:migration": "wrangler d1 migrations apply my-database --local",
    "remote:migration": "wrangler d1 migrations apply my-database --remote"
  }
}
package.json

pnpm generate で、drizzle ディレクトリに、マイグレーションファイルを作成し、pnpm local:migration でローカルDBにテーブルを作成します。

実装
src/index.ts で実装をしていきます。

前回までで、React で Googleサインインボタンを配置し、 admin 配下を認証必要にするところを実装しました。

ボタンが押されたタイミングで、ユーザー情報をデータベースに保存するように追加改修します。


具体実装は Auth.js で提供されており、アプリ側の実装はかなり簡単です。

new Hono をする際に Bindings を渡し、

Copy
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

initAuthConfig で adapter: DrizzleAdapter(drizzle(c.env.DB)), を指定するだけで大丈夫です。

今回はセッションは JWT を使うため、session stragegy を jwt に指定します。

Copy
app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    adapter: DrizzleAdapter(drizzle(c.env.DB)),
    providers: [
      Google({
        clientId: c.env.GOOGLE_ID,
        clientSecret: c.env.GOOGLE_SECRET,
      }),
    ],
    session: {
      strategy: 'jwt',
    },
  }))
)

src/index.ts 全文はこちらになります。

Copy
import Google from '@auth/core/providers/google';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';
import { drizzle } from "drizzle-orm/d1";
import { Hono } from 'hono';
import { renderToString } from 'react-dom/server';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    adapter: DrizzleAdapter(drizzle(c.env.DB)),
    providers: [
      Google({
        clientId: c.env.GOOGLE_ID,
        clientSecret: c.env.GOOGLE_SECRET,
      }),
    ],
    session: {
      strategy: 'jwt',
    },
  }))
)

app.use('/api/auth/*', authHandler())

app.use('/admin/*', verifyAuth())

app.get('/', (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/root.js" />
          ) : (
            <script type="module" src="/src/root.tsx" />
          )}
          <body>
            <div id="root" />
          </body>
        </head>
      </html>
    )
  )
})

app.get('/admin', (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/admin.js" />
          ) : (
            <script type="module" src="/src/admin.tsx" />
          )}
          <body>
            <div id="root" />
          </body>
        </head>
      </html>
    )
  )
})

export default app
src/index.ts

これでサインインすれば、ユーザー情報が保存されるはずです。


例えば、以下のようにして、ログインユーザーとユーザー一覧を取得できます。

Copy
import { getAuthUser } from '@hono/auth-js';
import { eq } from "drizzle-orm";
import { accounts, users } from './db/schema';

app.get("/users", async (c) => {
  const authUser = await getAuthUser(c);
  const db = drizzle(c.env.DB);
  const users = await db.select().from(users).leftJoin(accounts, eq(users.id, accounts.userId)).all();
  return c.json([authUser, users]);
});
本番デプロイ
Cloudflare のコンソールでBindings を設定します。Database Name は、DB とします。（Hono に Bindings として設定した定数名です。）


本番DBにマイグレーションを適用します

Copy
pnpm remote:migration 

これでデプロイすれば本番でも動作するはずです。