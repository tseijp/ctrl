import { Hono } from 'hono'
import { TeamModel } from '../../../../../models/team'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// チームメンバー関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// チームメンバー削除API
app.delete('/', async (c) => {
        const user = c.get('user')
        const teamId = c.req.param('id')
        const memberIdToRemove = c.req.param('userId')
        if (!teamId || !memberIdToRemove) return c.json({ error: 'Team ID and User ID are required' }, 400)
        try {
                // チームを取得
                const team = await TeamModel.findById(teamId, c.env)
                if (!team) return c.json({ error: 'Team not found' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                // 自分自身を削除しようとしていないか確認
                if (memberIdToRemove === user.id) return c.json({ error: 'Cannot remove yourself from the team' }, 400)

                // ユーザーをチームから削除
                const success = await TeamModel.removeMember(team.id, memberIdToRemove, c.env)
                if (!success) return c.json({ error: 'Failed to remove member' }, 500)

                return c.json({ success: true })
        } catch (error) {
                console.error('Remove member error:', error)
                return c.json({ error: 'Failed to remove member' }, 500)
        }
})

export default app
