import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../models/project'
import { LayerModel } from '../../../models/layer'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// プロジェクト更新用のスキーマ
const updateProjectSchema = z.object({
        name: z.string().min(1).max(100).optional(),
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

// プロジェクト詳細取得API
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

                // プロジェクトの最終アクセス日時を更新
                await ProjectModel.updateLastAccessed(project.id, c.env)

                // レイヤー一覧を取得
                const layers = await LayerModel.findByProjectId(project.id, c.env)

                return c.json({ project, layers })
        } catch (error) {
                console.error('Get project error:', error)
                return c.json({ error: 'Failed to get project' }, 500)
        }
})

// プロジェクト更新API
app.put('/', zValidator('json', updateProjectSchema), async (c) => {
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

                // プロジェクトを更新
                const updatedProject = await ProjectModel.update(project.id, data, c.env)
                if (!updatedProject) return c.json({ error: 'Failed to update project' }, 500)

                return c.json({ project: updatedProject })
        } catch (error) {
                console.error('Update project error:', error)
                return c.json({ error: 'Failed to update project' }, 500)
        }
})

// プロジェクト削除API
app.delete('/', async (c) => {
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

                // プロジェクトを削除
                const success = await ProjectModel.delete(project.id, c.env)
                if (!success) return c.json({ error: 'Failed to delete project' }, 500)

                return c.json({ success: true })
        } catch (error) {
                console.error('Delete project error:', error)
                return c.json({ error: 'Failed to delete project' }, 500)
        }
})

export default app
