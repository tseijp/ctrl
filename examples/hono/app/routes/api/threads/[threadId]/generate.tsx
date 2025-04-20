import { Hono } from 'hono'
import { ProjectModel } from '../../../../models/project'
import { ThreadModel } from '../../../../models/thread'
import { ChatModel } from '../../../../models/chat'
import { User } from '../../../../models/user'
import { Env } from '../../../../global'

// LLMによるUI生成API
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// LLMによるUI生成API
app.post('/', async (c) => {
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

                // チャット履歴を取得
                const chats = await ChatModel.findByThreadId(thread.id, c.env)

                // TODO: ここでLLMによるUI生成処理を実装
                // 現在はモックレスポンスを返す
                const assistantChat = await ChatModel.createAssistantMessage(
                        thread.id,
                        `
UIを生成しました。以下のコンポーネントを追加しました：
1. ヘッダー（Header）
2. ナビゲーションバー（NavBar）
3. メインコンテンツエリア（MainContent）
4. フッター（Footer）`.trim(),
                        c.env
                )

                // TODO: 実際にはここでノードを作成する処理を追加
                return c.json({
                        success: true,
                        message: 'UI generated successfully',
                        assistantChat,
                })
        } catch (error) {
                console.error('Generate UI error:', error)
                return c.json({ error: 'Failed to generate UI' }, 500)
        }
})

export default app
