import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { NodeModel } from '../../../../../models/node'
import { EdgeModel } from '../../../../../models/edge'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// エッジ更新用のスキーマ
const updateEdgeSchema = z.object({
        type: z.string().optional(),
        properties: z.record(z.string(), z.any()).optional(),
        sourceNodeId: z.string().uuid().optional(),
        targetNodeId: z.string().uuid().optional(),
})

// エッジ関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// エッジ詳細取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const edgeId = c.req.param('edgeId')

        if (!projectId || !edgeId) return c.json({ error: 'Project ID and Edge ID are required' }, 400)

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // エッジを取得
                const edge = await EdgeModel.findById(edgeId, c.env)
                if (!edge) return c.json({ error: 'Edge not found' }, 404)

                // エッジがプロジェクトに属しているか確認
                if (edge.projectId !== projectId) return c.json({ error: 'Edge does not belong to this project' }, 400)

                return c.json({ edge })
        } catch (error) {
                console.error('Get edge error:', error)
                return c.json({ error: 'Failed to get edge' }, 500)
        }
})

// エッジ更新API
app.put('/', zValidator('json', updateEdgeSchema), async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const edgeId = c.req.param('edgeId')
        const data = c.req.valid('json')

        if (!projectId || !edgeId) {
                return c.json({ error: 'Project ID and Edge ID are required' }, 400)
        }

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // エッジを取得
                const edge = await EdgeModel.findById(edgeId, c.env)
                if (!edge) return c.json({ error: 'Edge not found' }, 404)

                // エッジがプロジェクトに属しているか確認
                if (edge.projectId !== projectId) return c.json({ error: 'Edge does not belong to this project' }, 400)

                // ソースノードまたはターゲットノードが変更される場合、存在確認
                if (data.sourceNodeId || data.targetNodeId) {
                        const sourceNodeId = data.sourceNodeId || edge.sourceNodeId
                        const targetNodeId = data.targetNodeId || edge.targetNodeId
                        const [sourceNode, targetNode] = await Promise.all([
                                NodeModel.findById(sourceNodeId, c.env),
                                NodeModel.findById(targetNodeId, c.env),
                        ])
                        if (!sourceNode) return c.json({ error: 'Source node not found' }, 404)
                        if (!targetNode) return c.json({ error: 'Target node not found' }, 404)

                        // ノードがプロジェクトに属しているか確認
                        if (sourceNode.projectId !== projectId || targetNode.projectId !== projectId)
                                return c.json({ error: 'Nodes do not belong to this project' }, 400)
                }

                // エッジを更新
                const updatedEdge = await EdgeModel.update(edgeId, data, c.env)
                if (!updatedEdge) return c.json({ error: 'Failed to update edge' }, 500)

                return c.json({ edge: updatedEdge })
        } catch (error) {
                console.error('Update edge error:', error)
                return c.json({ error: 'Failed to update edge' }, 500)
        }
})

// エッジ削除API
app.delete('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const edgeId = c.req.param('edgeId')

        if (!projectId || !edgeId) {
                return c.json({ error: 'Project ID and Edge ID are required' }, 400)
        }

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // エッジを取得
                const edge = await EdgeModel.findById(edgeId, c.env)
                if (!edge) return c.json({ error: 'Edge not found' }, 404)

                // エッジがプロジェクトに属しているか確認
                if (edge.projectId !== projectId) return c.json({ error: 'Edge does not belong to this project' }, 400)

                // エッジを削除
                const success = await EdgeModel.delete(edgeId, c.env)
                if (!success) return c.json({ error: 'Failed to delete edge' }, 500)

                return c.json({ success: true })
        } catch (error) {
                console.error('Delete edge error:', error)
                return c.json({ error: 'Failed to delete edge' }, 500)
        }
})

export default app
