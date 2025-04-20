import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../models/project'
import { ThreadModel } from '../../../models/thread'
import { ChatModel } from '../../../models/chat'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// スレッド更新用のスキーマ
const updateThreadSchema = z.object({
        title: z.string().max(200).optional(),
        positionX: z.string().optional(),
        positionY: z.string().optional(),
})

// スレッド関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// スレッド詳細取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const threadId = c.req.param('threadId')
        if (!threadId) return c.json({ error: 'Thread ID is required' }, 400)
        try {
                // スレッドを取得
                const thread = await ThreadModel.findById(threadId, c.env)
                if (!thread) return c.json({ error: 'Thread not found' }, 404)

                // プロジェクトを取得
                const project = await ProjectModel.findById(thread.projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // チャット一覧を取得
                const chats = await ChatModel.findByThreadId(thread.id, c.env)
                return c.json({ thread, chats })
        } catch (error) {
                console.error('Get thread error:', error)
                return c.json({ error: 'Failed to get thread' }, 500)
        }
})

// スレッド更新API
app.put('/', zValidator('json', updateThreadSchema), async (c) => {
        const user = c.get('user')
        const threadId = c.req.param('threadId')
        const data = c.req.valid('json')
        if (!threadId) return c.json({ error: 'Thread ID is required' }, 400)
        try {
                // スレッドを取得
                const thread = await ThreadModel.findById(threadId, c.env)
                if (!thread) return c.json({ error: 'Thread not found' }, 404)

                // プロジェクトを取得
                const project = await ProjectModel.findById(thread.projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // スレッドを更新
                const updatedThread = await ThreadModel.update(thread.id, data, c.env)
                if (!updatedThread) return c.json({ error: 'Failed to update thread' }, 500)

                return c.json({ thread: updatedThread })
        } catch (error) {
                console.error('Update thread error:', error)
                return c.json({ error: 'Failed to update thread' }, 500)
        }
})

// スレッド削除API
app.delete('/', async (c) => {
        const user = c.get('user')
        const threadId = c.req.param('threadId')
        if (!threadId) return c.json({ error: 'Thread ID is required' }, 400)
        try {
                // スレッドを取得
                const thread = await ThreadModel.findById(threadId, c.env)
                if (!thread) return c.json({ error: 'Thread not found' }, 404)

                // プロジェクトを取得
                const project = await ProjectModel.findById(thread.projectId, c.env)
                if (!project) return c.json({ error: 'Project not found' }, 404)

                // ユーザーがプロジェクトにアクセスできるか確認
                if (project.teamId !== user.teamId && project.createdByUserId !== user.id)
                        return c.json({ error: 'Unauthorized' }, 403)

                // スレッドに関連するチャットを削除
                await ChatModel.deleteByThreadId(thread.id, c.env)

                // スレッドを削除
                const success = await ThreadModel.delete(thread.id, c.env)
                if (!success) return c.json({ error: 'Failed to delete thread' }, 500)

                return c.json({ success: true })
        } catch (error) {
                console.error('Delete thread error:', error)
                return c.json({ error: 'Failed to delete thread' }, 500)
        }
})

export default app
