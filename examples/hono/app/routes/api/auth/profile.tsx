import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { UserModel, User } from '../../../models/user'
import { authMiddleware } from '../../../auth/middleware'
import { Env } from '../../../global'

// プロフィール更新用のスキーマ
const profileUpdateSchema = z.object({
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
})

// プロフィール更新API
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

app.put('/', authMiddleware, zValidator('json', profileUpdateSchema), async (c) => {
        const user = c.get('user')
        if (!user) return c.json({ error: 'Unauthorized' }, 401)
        const data = c.req.valid('json')
        try {
                const updatedUser = await UserModel.update(user.id, data, c.env)
                if (!updatedUser) return c.json({ error: 'Failed to update profile' }, 500)

                return c.json({ user: updatedUser })
        } catch (error) {
                console.error('Profile update error:', error)
                return c.json({ error: 'Failed to update profile' }, 500)
        }
})

export default app
