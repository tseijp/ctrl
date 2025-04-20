import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../models/project'
import { LayerModel } from '../../../models/layer'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// プロジェクト作成用のスキーマ
const createProjectSchema = z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        thumbnailUrl: z.string().url().optional(),
})

// プロジェクト関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// プロジェクト一覧取得API
app.get('/', async (c) => {
        const user = c.get('user')
        try {
                // ユーザーがアクセスできるプロジェクト一覧を取得
                const projects = await ProjectModel.findByUserAccess(user.id, user.teamId || null, c.env)
                return c.json({ projects })
        } catch (error) {
                console.error('Get projects error:', error)
                return c.json({ error: 'Failed to get projects' }, 500)
        }
})

// プロジェクト作成API
app.post('/', zValidator('json', createProjectSchema), async (c) => {
        const user = c.get('user')
        const data = c.req.valid('json')

        try {
                // 新しいプロジェクトを作成
                const project = await ProjectModel.create(
                        {
                                id: crypto.randomUUID(),
                                ...data,
                                teamId: user.teamId || undefined, // nullの場合はundefinedに変換
                                createdByUserId: user.id,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                lastAccessed: new Date().toISOString(),
                        },
                        c.env
                )

                // デフォルトレイヤーを作成
                const defaultLayer = await LayerModel.create(
                        {
                                id: crypto.randomUUID(),
                                projectId: project.id,
                                name: 'Default Layer',
                                orderIndex: 0,
                                isVisible: true,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                return c.json({ project, defaultLayer }, 201)
        } catch (error) {
                console.error('Create project error:', error)
                return c.json({ error: 'Failed to create project' }, 500)
        }
})

export default app
