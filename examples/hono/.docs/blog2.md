hono/auth-js を使って Hono/Cloudflare pages で Google認証する
Hono
Cloudflare
Hono の 3rd-party middleware @hono/auth-js を使って、Cloudflare pages で Google認証 を実装してみます

今回はDBなどは使用せずAuth.js のデフォルト実装であるJWTによるトークン認証のみを実装します。


事前準備
Hono の Cloudflare Pages テンプレートで Hono アプリを作成し、Cloudflare の管理画面から Cloudflare Pages の Application を作成して、デプロイできる環境を整えます。

Copy
pnpm create hono@latest my-app
この記事では pnpm をパッケージマネージャーとして使っています。


また、Google Cloud でプロジェクトを作成し、APIとサービスから、OAuth 2.0 クライアント ID を作成しておきます。

その際、承認済みの JavaScript 生成元には、ローカルのエンドポイントと Cloudflare Pages のエンドポイントを指定し、

Copy
http://localhost:5173
https://my-app.pages.dev
承認済みのリダイレクト URI には /api/auth/callback/google をつけたものを指定しておきます。

Copy
http://localhost:5173/api/auth/callback/google
https://my-app.pages.dev/api/auth/callback/google
@hono/auth-js の導入
@hono/auth-js の README に従って進めていきます。


パッケージインストール

Copy
pnpm i hono @hono/auth-js @auth/core

wrangler.toml の [vars] もしくは、.dev.vars ファイルに以下の環境変数を定義します。（今回は .dev.vars を作成します）


AUTH_SECRET は openssl rand -base64 32 などで作成した、十分に長いランダム文字列を使います

GOOGLE_ID と GOOGLE_SECRET は 事前に作成しておいた Google Cloud の OAuth 2.0 クライアント ID のクライアントID とクライアントシークレットを指定します

Copy
AUTH_URL = "http://localhost:5173/api/auth"
AUTH_SECRET = "XXXXXXX"
GOOGLE_ID = "XXXXXXX"
GOOGLE_SECRET = "XXXXXX"
.dev.vars
実装
auth-js でログイン有無を検証する
@hono/auth-js を使ってGoogle 認証を実装していきます。

今回は、 /admin 配下のみ認証を必要とするアプリケーションを想定しています。


一旦、 /admin 配下を認証必要にするところまで実装します。

Copy
import Google from '@auth/core/providers/google'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_ID,
        clientSecret: c.env.GOOGLE_SECRET,
      }),
    ],
  }))
)

app.use('/api/auth/*', authHandler())

app.use('/admin/*', verifyAuth())

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/admin', (c) => {
  return c.render(<h1>Hello! Admin</h1>)
})

export default app
src/index.tsx
この時点で、http://localhost:5173/admin にアクセスすると Unauthorized となると思います

Image in a image block

次に、サインインボタンとサインアウトボタンを置いて、画面上にログインユーザー情報を表示するところを実装したいのですが、hono/auth-js は react を使用しているため、Hono で React Component を使えるようにします。

Hono で React を使えるようにする
こちらを参考に React を使えるようにしていきます


react 関連のパッケージをインストール

Copy
pnpm i react react-dom
pnpm i -D @types/react @types/react-dom
tsconfig.json の lib と jsxImportSource を修正

Copy
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable"
    ],
    "types": [
      "@cloudflare/workers-types/2023-07-01",
      "vite/client"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
}
tsconfig.json
index.tsx に renderToString を使い、 <div id=”root” /> を配置

/ と /admin でそれぞれ src/root.tsx と src/admin.tsx を読み込んでいます。

Copy
import Google from '@auth/core/providers/google'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_ID,
        clientSecret: c.env.GOOGLE_SECRET,
      }),
    ],
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
          <script type="module" src="/src/root.tsx" />
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
          <script type="module" src="/src/admin.tsx" />
          <body>
            <div id="root" />
          </body>
        </head>
      </html>
    )
  )
})

export default app
src/index.tsx
SignIn と SignOut ボタンを追加
Client Component を追加して、SignIn と SignOut ボタンを配置していきます。

SignIn した後は、 /admin にリダイレクトするようにしています。


SiginIn と SiginOut ボタンは components/header.tsx に共通化して読み込んでいます


Copy
import { SessionProvider, useSession } from '@hono/auth-js/react'
import { createRoot } from 'react-dom/client'
import { Header } from './components/header'

function App() {
  return (
    <SessionProvider>
      <Header />
      <AdminLink />
    </SessionProvider>
  )
}

function AdminLink() {
  const { data: _session, status } = useSession()
  return (
    <>
      { status === "authenticated" && <a href="/admin">Admin</a> }
    </>
  )
}

const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
} else {
  console.error('Failed to find the root element')
}
src/root.tsx
Copy
import { SessionProvider } from '@hono/auth-js/react'
import { createRoot } from 'react-dom/client'
import { Header } from './components/header'

function App() {
  return (
    <SessionProvider>
      <Header />
      <h1>Welcome Admin!</h1>
    </SessionProvider>
  )
}

const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
} else {
  console.error('Failed to find the root element')
}
src/admin.tsx
Copy
import { signIn, signOut, useSession } from '@hono/auth-js/react'

export function Header() {
  const { data: session, status } = useSession()
  return (
    <>
      <div>I am {session?.user?.name || 'unknown'}</div>
      {
        status === "authenticated" ?
          <SignOutButton /> :
          <SignInButton />
      }
    </>
  )
}

function SignInButton() {
  return <button type="button" onClick={() => signIn('google', { redirect: true, callbackUrl: "/admin" })}>Sign in with Google</button>
}

function SignOutButton() {
  return <button type="button" onClick={() => signOut()}>Sign out</button>
}
components/header.tsx

これでローカルでGoogle認証ができるようになりました

Image in a image block
Image in a image block
Image in a image block
本番環境設定
このままでは Cloudflare 環境で動作しないので、本番環境の設定をしていきます


vite.config.ts のビルド設定を編集し、mode: ‘client’ の場合にファイル名を固定してバンドルするようにします

Copy
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: {
            root: './src/root.tsx',
            admin: './src/admin.tsx'
          },
          output: {
            entryFileNames: 'static/[name].js'
          }
        }
      }
    }
  }

  return {
    ssr: {
      external: ['react', 'react-dom']
    },
    plugins: [
      build(),
      devServer({
        adapter,
        entry: 'src/index.tsx'
      })
    ]
  }
})
vite.config.ts
src/index.ts も、本番環境ではバンドルファイルを読み込むように変更します

Copy
import Google from '@auth/core/providers/google'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_ID,
        clientSecret: c.env.GOOGLE_SECRET,
      }),
    ],
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

最後に package.json の build コマンドを修正し、 vite build --mode client で build するようにします

Copy
{
  "name": "my-app",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --mode client && vite build",
    "preview": "wrangler pages dev",
    "deploy": "pnpm run build && wrangler pages deploy"
  },
  "dependencies": {
    "@auth/core": "^0.37.4",
    "@hono/auth-js": "^1.0.15",
    "hono": "^4.6.12",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240529.0",
    "@hono/vite-build": "^1.0.0",
    "@hono/vite-dev-server": "^0.16.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "vite": "^5.2.12",
    "wrangler": "^3.57.2"
  }
}

これで Cloudflare にデプロイすれば、本番環境でも動作するはずです

Cloudflare で環境変数を設定するのも忘れずに。

Copy
AUTH_URL = "http://my-app.pages.dev/api/auth"
AUTH_SECRET = "XXXXXXX"
GOOGLE_ID = "XXXXXXX"
GOOGLE_SECRET = "XXXXXX"
最後に
alias 貼れば react ではなく hono/jsx/dom でも行けそうですが、そこまでは検証できずでした。

別途試してみようと思います。