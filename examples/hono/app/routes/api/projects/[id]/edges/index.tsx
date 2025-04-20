import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { NodeModel } from '../../../../../models/node'
import { EdgeModel } from '../../../../../models/edge'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// エッジ作成用のスキーマ
const createEdgeSchema = z.object({
        sourceNodeId: z.string().uuid(),
        targetNodeId: z.string().uuid(),
        type: z.string(),
        properties: z.record(z.string(), z.any()).optional(),
})

// エッジ関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// プロジェクトのエッジ一覧取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const nodeId = c.req.query('nodeId') // 特定のノードに関連するエッジのみを取得する場合

        if (!projectId) {
                return c.json({ error: 'Project ID is required' }, 400)
        }

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // エッジ一覧を取得
                let edges
                if (nodeId) edges = await EdgeModel.findByNodeId(nodeId, c.env)
                else edges = await EdgeModel.findByProjectId(projectId, c.env) // ノードIDが指定されていない場合は、プロジェクト全体のエッジを取得

                return c.json({ edges })
        } catch (error) {
                console.error('Get edges error:', error)
                return c.json({ error: 'Failed to get edges' }, 500)
        }
})

// エッジ作成API
app.post('/', zValidator('json', createEdgeSchema), async (c) => {
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

                // ソースノードとターゲットノードが存在するか確認
                const [sourceNode, targetNode] = await Promise.all([
                        NodeModel.findById(data.sourceNodeId, c.env),
                        NodeModel.findById(data.targetNodeId, c.env),
                ])

                if (!sourceNode) return c.json({ error: 'Source node not found' }, 404)
                if (!targetNode) return c.json({ error: 'Target node not found' }, 404)

                // ノードがプロジェクトに属しているか確認
                if (sourceNode.projectId !== projectId || targetNode.projectId !== projectId)
                        return c.json({ error: 'Nodes do not belong to this project' }, 400)

                // 新しいエッジを作成
                const edge = await EdgeModel.create(
                        {
                                id: crypto.randomUUID(),
                                projectId,
                                ...data,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                return c.json({ edge }, 201)
        } catch (error) {
                console.error('Create edge error:', error)
                return c.json({ error: 'Failed to create edge' }, 500)
        }
})

export default app
