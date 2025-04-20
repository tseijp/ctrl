import { createRoute } from 'honox/factory'
import { SessionProvider, signIn, useSession } from '@hono/auth-js/react'

// サインインページのPOSTハンドラー
export const POST = createRoute(async (c) => {
        const formData = await c.req.formData()
        const provider = formData.get('provider') as string
        const redirectTo = (formData.get('redirectTo') as string) || '/'

        // リダイレクトURLを生成
        const callbackUrl = new URL('/api/auth/callback/google', c.req.url)
        const signInUrl = new URL(`/api/auth/signin/${provider}`, c.req.url)
        signInUrl.searchParams.append('callbackUrl', redirectTo)

        return c.redirect(signInUrl.toString())
})

// サインインページのコンポーネント
function SignInPage() {
        const { data: session, status } = useSession()

        // 既にログインしている場合はホームページにリダイレクト
        if (status === 'authenticated')
                return (
                        <div>
                                <p>既にログインしています。</p>
                                <p>{session?.user?.name} としてログイン中</p>
                                <a href="/">ホームに戻る</a>
                        </div>
                )

        return (
                <div>
                        <h1>サインイン</h1>
                        <div>
                                <form method="post">
                                        <input type="hidden" name="provider" value="google" />
                                        <input type="hidden" name="redirectTo" value="/" />
                                        <button type="submit">Googleでサインイン</button>
                                </form>
                        </div>
                        <div>
                                <button onClick={() => signIn('google', { callbackUrl: '/' })}>
                                        Googleでサインイン (JavaScript)
                                </button>
                        </div>
                </div>
        )
}

// サインインページのルート
export default createRoute((c) => {
        return c.render(
                <SessionProvider>
                        <SignInPage />
                </SessionProvider>
        )
})
