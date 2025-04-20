import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
        const user = c.get('user')
        if (!user) return c.json({ error: 'Unauthorized' }, 401)
        return c.json({ user })
})
