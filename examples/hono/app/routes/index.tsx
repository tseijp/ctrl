import { createRoute } from 'honox/factory'
import { getAuthUser } from '@hono/auth-js'
import { SessionProvider, signIn, signOut, useSession } from '@hono/auth-js/react'
import Counter from '../islands/counter'
import Controller from '../islands/controller'

// 認証状態を表示するコンポーネント
function AuthStatus() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <p>Loading...</p>
  }
  
  if (status === 'authenticated') {
    return (
      <div>
        <p>ログイン中: {session.user?.name}</p>
        <button onClick={() => signOut()}>サインアウト</button>
      </div>
    )
  }
  
  return (
    <div>
      <p>未ログイン</p>
      <button onClick={() => signIn('google')}>Googleでサインイン</button>
      <a href="/auth/signin">サインインページへ</a>
    </div>
  )
}

export default createRoute(async (c) => {
  const name = c.req.query('name') ?? 'Hono'
  const authUser = await getAuthUser(c)
  return c.render(
    <Controller>
      <title>{name}</title>
      <h1>Hello, {authUser?.user?.name || name}!</h1>
      <SessionProvider>
        <AuthStatus />
      </SessionProvider>
      <Counter />
    </Controller>
  )
})
