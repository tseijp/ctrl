import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { NodeModel } from '../../../../../models/node'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// ノード作成用のスキーマ
const createNodeSchema = z.object({
        layerId: z.string().uuid(),
        type: z.string(),
        name: z.string().min(1).max(100),
        properties: z.record(z.string(), z.any()).optional(),
        positionX: z.string().optional(),
        positionY: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        tailwindClasses: z.string().optional(),
})

// ノード関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// プロジェクトのノード一覧取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const layerId = c.req.query('layerId')
        if (!projectId) return c.json({ error: 'Project ID is required' }, 400)
        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // ノード一覧を取得
                let nodes
                if (layerId) nodes = await NodeModel.findByLayerId(layerId, c.env)
                else nodes = await NodeModel.findByProjectId(projectId, c.env) // レイヤーIDが指定されていない場合は、プロジェクト全体のノードを取得

                return c.json({ nodes })
        } catch (error) {
                console.error('Get nodes error:', error)
                return c.json({ error: 'Failed to get nodes' }, 500)
        }
})

// ノード作成API
app.post('/', zValidator('json', createNodeSchema), async (c) => {
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

                // 新しいノードを作成
                const node = await NodeModel.create(
                        {
                                id: crypto.randomUUID(),
                                projectId,
                                ...data,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                createdBy: user.id, // ユーザーIDを記録
                        },
                        c.env
                )

                return c.json({ node }, 201)
        } catch (error) {
                console.error('Create node error:', error)
                return c.json({ error: 'Failed to create node' }, 500)
        }
})

export default app
