import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { TeamModel } from '../../../models/team'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// チーム更新用のスキーマ
const updateTeamSchema = z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        logoUrl: z.string().url().optional(),
})

// チーム関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// チーム詳細取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const teamId = c.req.param('id')
        if (!teamId) return c.json({ error: 'Team ID is required' }, 400)
        try {
                // チームを取得
                const team = await TeamModel.findById(teamId, c.env)
                if (!team) return c.json({ error: 'Team not found' }, 404)

                // ユーザーがチームに所属しているか確認
                if (user.teamId !== team.id) return c.json({ error: 'Unauthorized' }, 403)

                // チームメンバー一覧を取得
                const members = await TeamModel.getMembers(team.id, c.env)
                return c.json({ team, members })
        } catch (error) {
                console.error('Get team error:', error)
                return c.json({ error: 'Failed to get team' }, 500)
        }
})

// チーム更新API
app.put('/', zValidator('json', updateTeamSchema), async (c) => {
        const user = c.get('user')
        const teamId = c.req.param('id')
        const data = c.req.valid('json')
        if (!teamId) return c.json({ error: 'Team ID is required' }, 400)
        try {
                // チームを取得
                const team = await TeamModel.findById(teamId, c.env)
                if (!team) return c.json({ error: 'Team not found' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                // チームを更新
                const updatedTeam = await TeamModel.update(team.id, data, c.env)
                if (!updatedTeam) return c.json({ error: 'Failed to update team' }, 500)

                return c.json({ team: updatedTeam })
        } catch (error) {
                console.error('Update team error:', error)
                return c.json({ error: 'Failed to update team' }, 500)
        }
})

export default app
