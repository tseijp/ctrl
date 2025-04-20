import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { TeamModel } from '../../../../../models/team'
import { UserModel, User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// チームメンバー追加用のスキーマ
const addMemberSchema = z.object({
        userId: z.string().uuid(),
        role: z.enum(['admin', 'member']).default('member'),
})

// チームメンバー関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// チームメンバー追加API
app.post('/', zValidator('json', addMemberSchema), async (c) => {
        const user = c.get('user')
        const teamId = c.req.param('id')
        const { userId, role } = c.req.valid('json')
        if (!teamId) return c.json({ error: 'Team ID is required' }, 400)
        try {
                // チームを取得
                const team = await TeamModel.findById(teamId, c.env)
                if (!team) return c.json({ error: 'Team not found' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                // 追加するユーザーを取得
                const memberToAdd = await UserModel.findById(userId, c.env)
                if (!memberToAdd) return c.json({ error: 'User not found' }, 404)

                // ユーザーをチームに追加
                const updatedMember = await TeamModel.addMember(team.id, userId, role, c.env)
                if (!updatedMember) return c.json({ error: 'Failed to add member' }, 500)

                return c.json({ member: updatedMember })
        } catch (error) {
                console.error('Add member error:', error)
                return c.json({ error: 'Failed to add member' }, 500)
        }
})

export default app
