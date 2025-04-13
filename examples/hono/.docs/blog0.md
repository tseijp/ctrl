[flore](https://github.com/Kartore/flore)  という Feature Flag SaaS(?になるかもわからない) を開発し始めました。
せっかくだし気になっていた Honox を Cloudflare Workers にデプロイして使ってみようと思ったので、認証周りをあまり考えたくない & 拡張性を維持したいので  [Auth.js](https://authjs.dev/)  にまかせようと思い、 `@hono/auth-js`  を利用してみています。

そこで、Login 画面などをカスタマイズ出来る Auth.js の  [Custom Signin](https://authjs.dev/guides/pages/signin)  を使おうとしたところ思ったよりはまったのでメモ的に記事に残しておきます
今回の記事では Auth.js が何か、Hono が何かについては一切書きませんのでご了承ください。

## 前提

今回は

- `honox` v0.27.4
- `hono` v4.6.14
- `@auth/core` v0.37.4
- `@hono/auth-js` v1.0.15
- `drizzle-orm` v0.38.2
- `@auth/drizzle-adapter` v1.7.4

を使用します。スタイルは  `hono/css`  ではなく  `tailwindcss`を利用します。
また、デプロイ先は Cloudflare Workers を利用します。`nodejs_compat`(v2)のみ有効で、DB 用に D1 とクライアントサイドの JS/CSS の提供のため、Workers Asset を利用しています。

`initAuthConfig`, `authHandler`  については  `server.ts`  内で以下のように記述しています。

server.ts

```
const app = createApp({
  init(app) {
    app
      .use(
        '*',
        initAuthConfig((c) => {
          return {
            secret: c.env.AUTH_SECRET,
            providers: [
              GitHub({
                clientId: c.env.GITHUB_CLIENT_ID,
                clientSecret: c.env.GITHUB_CLIENT_SECRET,
              }),
            ],
            adapter: DrizzleAdapter(drizzle(c.env.DB))
          }
        })
      )
      .use('/api/auth/*', authHandler());
  },
});

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

## 方法 ① Island コンポーネントを使ってクライアント JS から SignIn を発火する

最も直感的でわかりやすい方法はこの方法だと思います。
`@hono/auth-js`  は React 向けの実装が含まれていますので、それらを使って  `signIn`  や  `signOut`, `useSession`  などを利用することも出来ます。

ただ、依存先に`react`(not `react-dom`) があるため、そのままでは HonoX 上では利用できません。
hono/jsx から react-render に移行しても良いのですが、せっかくならそのまま利用したいので react の一部実装が行われている`hono/jsx/dom`に alias を張ることで利用できるようにします。
やることはシンプルで \`vite.config.ts に resolve.alias を記述するのみです。
(build.rollupOptions は tailwind 向けの設定です)

vite.config.ts

```
import build from '@hono/vite-build/cloudflare-workers';
import adapter from '@hono/vite-dev-server/cloudflare';
import honox from 'honox/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [honox({ devServer: { adapter } }), build()],
    resolve: {
      alias: {
        react: 'hono/jsx/dom',
      },
    },
    build: {
      rollupOptions: {
        input: mode === 'client' ? ['app/index.css'] : [],
      },
    },
  };
});

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

こうすることで Island 内にコンポーネントを用意することで Custom Signin ページの提供なども行えるようになります

SigninButton.tsx

```
import { signIn } from '@hono/auth-js/react';

export const SignInButton = () => {
  return (
    <button type={'button'} onClick={() => signIn('github')}>
      Sign In
    </button>
  );
};

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

## 方法 ② Form を使ってサーバーサイドから SignIn を発火する

`next-auth` v5 や`@auth/sveltekit`などで提供されている Server Action を利用し、クライアント JS を用いない`signIn`の発火です。
`next-auth`  や  `@auth/sveltekit`  では  `AuthInstance`  から  `handle`(api 周りの handler) と共に適切に記述することで ServerAction として動作する  `signIn`  と  `signOut`  が Export されていますが、`@hono/auth-js`  では Export されていません。
また、なんとかサーバーサイドで無理矢理`signIn`を利用しようとしても、Cloudflare Workers は Workers 内部から自身の Workers への fetch リクエストを送ることが基本的には出来ないため、`/api/auth/signin`や`/api/auth/csrf`などを叩くことも叶いません。

そこで、`@auth/sveltekit`  や  `next-auth`  での実装を参考に  `honox`  で利用できる  `signIn`  と  `signOut`  を実装します。
honox では同じファイル内に複数の method を定義できるため、GET 側で form(自身に POST するもの)を用意し、POST 側の handler として Action を実行することで Next.js 等の ServerAction と似た利用ができるためこれを活用します。

### `@auth/sveltekit`  や  `next-auth`  での実装を参考に  `signIn`  を作成する

`next-auth`  での実装

`@auth/sveltekit`  での実装

これらを参考に signIn を実装していきます。

!

以下のサンプルでは Auth.js 公式に用意されている Double Submit Cookie を利用した CSRF 対策を無効化し、`hono/csrf`が提供する Origin Header を用いた CSRF 対策のみを実施しています。
CSRF 対策としては十分に動作していると考えていますが、筆者は一切の責任を負いませんので、CSRF に限らず必要に応じた対策を行ってください。
また、今回のサンプルコード内には  `hono/csrf`の middleware の追加は含まれていないため、必ず middleware に追加してください。
セキュリティ上問題のある箇所がありましたらコメントなどでお教えいただけますと幸いです

auth.ts

```
import { Auth, createActionURL, raw, setEnvDefaults, skipCSRFCheck } from '@auth/core';
import { ProviderType } from '@auth/core/providers';
import { AuthEnv } from '@hono/auth-js';
import {
  signIn as signInReactFunction,
  signOut as signOutReactFunction,
} from '@hono/auth-js/react';
import { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { setCookie } from 'hono/cookie';

type SignInParameters = Parameters<typeof signInReactFunction>;

export function signIn(authorizationParams?: SignInParameters[2]): MiddlewareHandler {
  return async (c) => {
    const config = c.get('authConfig');

    const formData = await c.req.formData();
    const formDataStringValues: { [key: string]: string | null } = {
      provider: null,
      redirectTo: null,
    };
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        formDataStringValues[key] = value;
      }
    });

    const { provider, redirectTo, ...rest } = formDataStringValues;
    const rawHeaders = c.req.raw.headers;

    const ctxEnv = env(c) as AuthEnv;
    setEnvDefaults(ctxEnv, config);

    const reqUrl = new URL(c.req.url);
    const protocol = reqUrl.protocol;

    const callbackUrl = redirectTo ?? c.req.header().Referer ?? '/';
    const signInURL = createActionURL('signin', protocol, rawHeaders, ctxEnv, config);

    if (!provider) {
      signInURL.searchParams.append('callbackUrl', callbackUrl);
      return c.redirect(signInURL.toString(), 302);
    }

    let url = `${signInURL.toString()}/${provider}?${new URLSearchParams(authorizationParams).toString()}`;
    let foundProvider: { id?: SignInParameters[0]; type?: ProviderType } = {};

    for (const providerConfig of config.providers) {
      const { options, ...defaults } =
        typeof providerConfig === 'function' ? providerConfig() : providerConfig;
      const id = (options?.id as string | undefined) ?? defaults.id;
      if (id === provider) {
        foundProvider = { id, type: (options?.type as ProviderType | undefined) ?? defaults.type };
        break;
      }
    }

    if (!foundProvider.id) {
      const url = `${signInURL.toString()}?${new URLSearchParams({ callbackUrl }).toString()}`;
      return c.redirect(url, 302);
    }

    if (foundProvider.type === 'credentials') {
      url = url.replace('signin', 'callback');
    }

    const body = new URLSearchParams({ ...rest, callbackUrl });
    const req = new Request(url, { method: 'POST', headers: rawHeaders, body });
    req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const res = await Auth(req, { ...config, raw, skipCSRFCheck });

    for (const resCookie of res?.cookies ?? []) {
      setCookie(c, resCookie.name, resCookie.value, {
        ...resCookie.options,
        sameSite:
          // ref: https://github.com/nextauthjs/next-auth/blob/a150f1e842fe44c068a9761c1f6e6d543c0f9d69/packages/core/src/lib/vendored/cookie.ts#L341-L360
          // typeof string -> sameSite lowercase string value
          // typeof boolean -> true = 'Strict', false = Invalid
          typeof resCookie.options.sameSite === 'string'
            ? resCookie.options.sameSite
            : resCookie.options.sameSite
              ? 'Strict'
              : undefined,
      });
    }

    return c.redirect(res.redirect!, 302);
  };
}

type SignOutParametes = Parameters<typeof signOutReactFunction>;

export function signOut(): MiddlewareHandler {
  return async (c) => {
    const config = c.get('authConfig');

    const formData = await c.req.formData();
    const redirectTo = formData.get('redirectTo');
    if (redirectTo && typeof redirectTo !== 'string') {
      return c.text('Invalid request: redirectTo is not string', 400);
    }

    const rawHeaders = c.req.raw.headers;

    const ctxEnv = env(c) as AuthEnv;
    setEnvDefaults(ctxEnv, config);

    const reqUrl = new URL(c.req.url);
    const protocol = reqUrl.protocol;

    const callbackUrl = redirectTo ?? c.req.header().Referer ?? '/';
    const signOutUrl = createActionURL('signout', protocol, rawHeaders, ctxEnv, config);

    const body = new URLSearchParams({ callbackUrl });
    const req = new Request(signOutUrl, { method: 'POST', headers: rawHeaders, body });
    req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const res = await Auth(req, { ...config, raw, skipCSRFCheck });

    for (const resCookie of res?.cookies ?? []) {
      setCookie(c, resCookie.name, resCookie.value, {
        ...resCookie.options,
        sameSite:
          // ref: https://github.com/nextauthjs/next-auth/blob/a150f1e842fe44c068a9761c1f6e6d543c0f9d69/packages/core/src/lib/vendored/cookie.ts#L341-L360
          // typeof string -> sameSite lowercase string value
          // typeof boolean -> true = 'Strict', false = Invalid
          typeof resCookie.options.sameSite === 'string'
            ? resCookie.options.sameSite
            : resCookie.options.sameSite
              ? 'Strict'
              : undefined,
      });
    }

    return c.redirect(res.redirect!, 302);
  };
}

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

### route で作成した者を利用する

これらを各 Route の定義から利用します。

SignIn ページ

signin.tsx

```
import { createRoute } from 'honox/factory';

import { signIn } from '../../utils/auth';

export const POST = createRoute(signIn());

export default createRoute(async (c) => {
  const user = c.get('authUser');
  if (user) {
    return c.redirect('/');
  }

  return c.render(
    <div><form method="post"><input type="hidden" name="provider" value="github" /><input type="hidden" name="redirectTo" value="/test" /><button type="submit">Sign in with GitHub</button></form></div>
  );
});

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

SignOut ページ

test.tsx

```
import { createRoute } from 'honox/factory';

import { signOut } from '../../utils/auth';

export const POST = createRoute(signOut());

export default createRoute((c) => {
  const auth = c.get('authUser');
  return c.render(
    <div><h1 class={'text-red-400'}>Test, {JSON.stringify(auth.session.user)}!</h1><form method={'post'}><input type={'hidden'} name={'redirectTo'} value={'/signin'} /><button type={'submit'}>Sign out</button></form></div>
  );
});

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

### CustomPage を設定する

server.ts で定義されている  `initAuthConfig`  内に  `pages.signIn`  を設定することで  `/api/auth/signin`  は  `/signin`  にリダイレクトするようになります（このとき callbackURL が queryParameter についてくるのでこの部分も追加で実装が必要です）

server.ts

```
const app = createApp({
  init(app) {
    app
      .use(csrf())
      .use(
        '*',
        initAuthConfig((c) => {
          return {
            secret: c.env.AUTH_SECRET,
            providers: [
              GitHub({
                clientId: c.env.GITHUB_CLIENT_ID,
                clientSecret: c.env.GITHUB_CLIENT_SECRET,
              }),
            ],
            adapter: DrizzleAdapter(drizzle(c.env.DB), {
              usersTable: users,
              accountsTable: accounts,
              sessionsTable: sessions,
              verificationTokensTable: verificationTokens,
            }),
            pages: {
              signIn: '/signin',
              error: '/error',
            },
          };
        })
      )
      .use('/api/auth/*', authHandler());
  },
});

```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

これで JavaScript を無効にしているユーザーでもログイン・ログアウトが行えるようになりました。

## おわりに

Auth.js は HonoX と組み合わせても island コンポーネントを活用することでとても簡単に認証回りを実装できるとても便利なライブラリです。
今回の方法 ② は JS が無効なユーザーでもログインが出来るという副産物的な利点しか存在しないような気がしていますが、island コンポーネントをさけたい場合などの実装の参考になればうれしいです。

今回の実装はこちらにありますので GitHub で見たい方はご確認ください

6
1
