import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { ThreadModel } from '../../../../../models/thread'
import { ChatModel } from '../../../../../models/chat'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// チャット作成用のスキーマ
const createChatSchema = z.object({
        content: z.string(),
})

// チャット関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// チャット一覧取得API
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
                return c.json({ chats })
        } catch (error) {
                console.error('Get chats error:', error)
                return c.json({ error: 'Failed to get chats' }, 500)
        }
})

// チャット作成API
app.post('/', zValidator('json', createChatSchema), async (c) => {
        const user = c.get('user')
        const threadId = c.req.param('threadId')
        const { content } = c.req.valid('json')
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

                // ユーザーメッセージを作成
                const chat = await ChatModel.createUserMessage(thread.id, user.id, content, c.env)

                // TODO: ここでLLMによる応答を生成する処理を追加
                // 現在は簡易的な応答を返す
                const assistantChat = await ChatModel.createAssistantMessage(
                        thread.id,
                        `ご要望を承りました。「${content}」について検討します。`,
                        c.env
                )

                return c.json({ chat, assistantChat }, 201)
        } catch (error) {
                console.error('Create chat error:', error)
                return c.json({ error: 'Failed to create chat' }, 500)
        }
})

export default app
