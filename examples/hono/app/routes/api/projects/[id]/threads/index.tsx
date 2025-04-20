import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { ProjectModel } from '../../../../../models/project'
import { ThreadModel } from '../../../../../models/thread'
import { ChatModel } from '../../../../../models/chat'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// スレッド作成用のスキーマ
const createThreadSchema = z.object({
        title: z.string().max(200).optional(),
        positionX: z.string().optional(),
        positionY: z.string().optional(),
        initialMessage: z.string().optional(), // 初期メッセージ（オプション）
})

// スレッド関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// プロジェクトのスレッド一覧取得API
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

                // スレッド一覧を取得
                const threads = await ThreadModel.findByProjectId(projectId, c.env)

                return c.json({ threads })
        } catch (error) {
                console.error('Get threads error:', error)
                return c.json({ error: 'Failed to get threads' }, 500)
        }
})

// スレッド作成API
app.post('/', zValidator('json', createThreadSchema), async (c) => {
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

                // 新しいスレッドを作成
                const thread = await ThreadModel.create(
                        {
                                id: crypto.randomUUID(),
                                projectId,
                                title: data.title || 'New Thread',
                                positionX: data.positionX,
                                positionY: data.positionY,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                // 初期メッセージがある場合は作成
                let initialChat = null
                if (data.initialMessage) {
                        initialChat = await ChatModel.createUserMessage(thread.id, user.id, data.initialMessage, c.env)

                        // TODO: ここでLLMによる応答を生成する処理を追加
                        // 現在は簡易的な応答を返す
                        await ChatModel.createAssistantMessage(
                                thread.id,
                                `こんにちは！どのようなUIを作成しますか？`,
                                c.env
                        )
                }

                return c.json({ thread, initialChat }, 201)
        } catch (error) {
                console.error('Create thread error:', error)
                return c.json({ error: 'Failed to create thread' }, 500)
        }
})

export default app
