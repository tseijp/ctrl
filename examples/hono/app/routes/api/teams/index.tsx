import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { TeamModel } from '../../../models/team'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// チーム作成用のスキーマ
const createTeamSchema = z.object({
        name: z.string().min(1).max(100),
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

// チーム一覧取得API
app.get('/', async (c) => {
        const user = c.get('user')
        try {
                // ユーザーが所属しているチームを取得
                const team = user.teamId ? await TeamModel.findById(user.teamId, c.env) : null

                // ユーザーがadminの場合は、そのチームを返す
                if (team && user.role === 'admin') return c.json({ teams: [team] })

                // ユーザーがmemberの場合は、そのチームのみ返す
                if (team) return c.json({ teams: [team] })

                // チームに所属していない場合は空配列を返す
                return c.json({ teams: [] })
        } catch (error) {
                console.error('Get teams error:', error)
                return c.json({ error: 'Failed to get teams' }, 500)
        }
})

// チーム作成API
app.post('/', zValidator('json', createTeamSchema), async (c) => {
        const user = c.get('user')
        const data = c.req.valid('json')

        try {
                // 新しいチームを作成
                const team = await TeamModel.create(
                        {
                                id: crypto.randomUUID(),
                                ...data,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                // ユーザーをチームに追加（admin権限で）
                await TeamModel.addMember(team.id, user.id, 'admin', c.env)
                return c.json({ team }, 201)
        } catch (error) {
                console.error('Create team error:', error)
                return c.json({ error: 'Failed to create team' }, 500)
        }
})

export default app
