'use client'

import { createRoute } from 'honox/factory'
import SignIn from '../islands/signin'

// サインインページのルート
export default createRoute((c) => {
        return c.render(<SignIn />)
})
