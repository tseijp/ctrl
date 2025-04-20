import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { LayerModel } from '../../../../../models/layer'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// レイヤー作成用のスキーマ
const createLayerSchema = z.object({
        name: z.string().min(1).max(100),
        isVisible: z.boolean().default(true),
})

// レイヤー関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// レイヤー一覧取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        if (!projectId) return c.json({ error: 'Project ID is required' }, 400)
        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // レイヤー一覧を取得
                const layers = await LayerModel.findByProjectId(project.id, c.env)

                return c.json({ layers })
        } catch (error) {
                console.error('Get layers error:', error)
                return c.json({ error: 'Failed to get layers' }, 500)
        }
})

// レイヤー作成API
app.post('/', zValidator('json', createLayerSchema), async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const data = c.req.valid('json')

        if (!projectId) return c.json({ error: 'Project ID is required' }, 400)

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // 新しいレイヤーを作成
                const layer = await LayerModel.create(
                        {
                                id: crypto.randomUUID(),
                                projectId: project.id,
                                ...data,
                                orderIndex: 0, // デフォルトは0、LayerModelで自動的に最大値+1に設定される
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                return c.json({ layer }, 201)
        } catch (error) {
                console.error('Create layer error:', error)
                return c.json({ error: 'Failed to create layer' }, 500)
        }
})

export default app
