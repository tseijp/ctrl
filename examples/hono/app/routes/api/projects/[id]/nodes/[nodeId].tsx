import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { NodeModel } from '../../../../../models/node'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// ノード更新用のスキーマ
const updateNodeSchema = z.object({
        type: z.string().optional(),
        name: z.string().min(1).max(100).optional(),
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

// ノード詳細取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const nodeId = c.req.param('nodeId')

        if (!projectId || !nodeId) return c.json({ error: 'Project ID and Node ID are required' }, 400)

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // ノードを取得
                const node = await NodeModel.findById(nodeId, c.env)
                if (!node) return c.json({ error: 'Node not found' }, 404)

                // ノードがプロジェクトに属しているか確認
                if (node.projectId !== projectId)
                        return c.json(
                                {
                                        error: 'Node does not belong to this project',
                                },
                                400
                        )

                return c.json({ node })
        } catch (error) {
                console.error('Get node error:', error)
                return c.json({ error: 'Failed to get node' }, 500)
        }
})

// ノード更新API
app.put('/', zValidator('json', updateNodeSchema), async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const nodeId = c.req.param('nodeId')
        const data = c.req.valid('json')

        if (!projectId || !nodeId) {
                return c.json({ error: 'Project ID and Node ID are required' }, 400)
        }

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // ノードを取得
                const node = await NodeModel.findById(nodeId, c.env)
                if (!node) return c.json({ error: 'Node not found' }, 404)

                // ノードがプロジェクトに属しているか確認
                if (node.projectId !== projectId)
                        return c.json(
                                {
                                        error: 'Node does not belong to this project',
                                },
                                400
                        )

                // ノードを更新
                const updatedNode = await NodeModel.update(nodeId, data, c.env)
                if (!updatedNode) return c.json({ error: 'Failed to update node' }, 500)

                return c.json({ node: updatedNode })
        } catch (error) {
                console.error('Update node error:', error)
                return c.json({ error: 'Failed to update node' }, 500)
        }
})

// ノード削除API
app.delete('/', async (c) => {
        const user = c.get('user')
        const projectId = c.req.param('id')
        const nodeId = c.req.param('nodeId')

        if (!projectId || !nodeId) {
                return c.json({ error: 'Project ID and Node ID are required' }, 400)
        }

        try {
                // プロジェクトを取得
                const project = await ProjectModel.findById(projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // ノードを取得
                const node = await NodeModel.findById(nodeId, c.env)
                if (!node) return c.json({ error: 'Node not found' }, 404)

                // ノードがプロジェクトに属しているか確認
                if (node.projectId !== projectId)
                        return c.json(
                                {
                                        error: 'Node does not belong to this project',
                                },
                                400
                        )

                // ノードを削除
                const success = await NodeModel.delete(nodeId, c.env)
                if (!success) return c.json({ error: 'Failed to delete node' }, 500)

                return c.json({ success: true })
        } catch (error) {
                console.error('Delete node error:', error)
                return c.json({ error: 'Failed to delete node' }, 500)
        }
})

export default app
