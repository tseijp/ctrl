import { SessionProvider, signIn, useSession } from '@hono/auth-js/react'

// サインインページのコンポーネント
function SignInImpl() {
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

        const handleClick = () => {
                signIn('google', { redirect: true, callbackUrl: '/admin' })
        }

        return (
                <div>
                        <h1>サインイン</h1>
                        <div>
                                <button onClick={handleClick}>Googleでサインイン (JavaScript)</button>
                        </div>
                </div>
        )
}

export default function SignIn() {
        return (
                <SessionProvider>
                        <SignInImpl />
                </SessionProvider>
        )
}
