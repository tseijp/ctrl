import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ProjectModel } from '../../models/project';
import { ThreadModel } from '../../models/thread';
import { ChatModel } from '../../models/chat';
import { User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// スレッド関連のAPIルーター
const threadsRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// スレッド作成用のスキーマ
const createThreadSchema = z.object({
  title: z.string().max(200).optional(),
  positionX: z.string().optional(),
  positionY: z.string().optional(),
  initialMessage: z.string().optional(), // 初期メッセージ（オプション）
});

// スレッド更新用のスキーマ
const updateThreadSchema = z.object({
  title: z.string().max(200).optional(),
  positionX: z.string().optional(),
  positionY: z.string().optional(),
});

// チャット作成用のスキーマ
const createChatSchema = z.object({
  content: z.string(),
});

// プロジェクトのスレッド一覧取得API
threadsRouter.get('/:projectId/threads', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  
  try {
    // プロジェクトを取得
    const project = await ProjectModel.findById(projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // スレッド一覧を取得
    const threads = await ThreadModel.findByProjectId(projectId, c.env);
    
    return c.json({ threads });
  } catch (error) {
    console.error('Get threads error:', error);
    return c.json({ error: 'Failed to get threads' }, 500);
  }
});

// スレッド作成API
threadsRouter.post('/:projectId/threads', authMiddleware, zValidator('json', createThreadSchema), async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const data = c.req.valid('json');
  
  try {
    // プロジェクトを取得
    const project = await ProjectModel.findById(projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // 新しいスレッドを作成
    const thread = await ThreadModel.create({
      id: crypto.randomUUID(),
      projectId,
      title: data.title || 'New Thread',
      positionX: data.positionX,
      positionY: data.positionY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    // 初期メッセージがある場合は作成
    let initialChat = null;
    if (data.initialMessage) {
      initialChat = await ChatModel.createUserMessage(
        thread.id,
        user.id,
        data.initialMessage,
        c.env
      );
      
      // TODO: ここでLLMによる応答を生成する処理を追加
      // 現在は簡易的な応答を返す
      await ChatModel.createAssistantMessage(
        thread.id,
        `こんにちは！どのようなUIを作成しますか？`,
        c.env
      );
    }
    
    return c.json({ thread, initialChat }, 201);
  } catch (error) {
    console.error('Create thread error:', error);
    return c.json({ error: 'Failed to create thread' }, 500);
  }
});

// スレッド詳細取得API
threadsRouter.get('/threads/:threadId', authMiddleware, async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チャット一覧を取得
    const chats = await ChatModel.findByThreadId(thread.id, c.env);
    
    return c.json({ thread, chats });
  } catch (error) {
    console.error('Get thread error:', error);
    return c.json({ error: 'Failed to get thread' }, 500);
  }
});

// スレッド更新API
threadsRouter.put('/threads/:threadId', authMiddleware, zValidator('json', updateThreadSchema), async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  const data = c.req.valid('json');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // スレッドを更新
    const updatedThread = await ThreadModel.update(thread.id, data, c.env);
    if (!updatedThread) {
      return c.json({ error: 'Failed to update thread' }, 500);
    }
    
    return c.json({ thread: updatedThread });
  } catch (error) {
    console.error('Update thread error:', error);
    return c.json({ error: 'Failed to update thread' }, 500);
  }
});

// スレッド削除API
threadsRouter.delete('/threads/:threadId', authMiddleware, async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // スレッドに関連するチャットを削除
    await ChatModel.deleteByThreadId(thread.id, c.env);
    
    // スレッドを削除
    const success = await ThreadModel.delete(thread.id, c.env);
    if (!success) {
      return c.json({ error: 'Failed to delete thread' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete thread error:', error);
    return c.json({ error: 'Failed to delete thread' }, 500);
  }
});

// チャット一覧取得API
threadsRouter.get('/threads/:threadId/chats', authMiddleware, async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チャット一覧を取得
    const chats = await ChatModel.findByThreadId(thread.id, c.env);
    
    return c.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    return c.json({ error: 'Failed to get chats' }, 500);
  }
});

// チャット作成API
threadsRouter.post('/threads/:threadId/chats', authMiddleware, zValidator('json', createChatSchema), async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  const { content } = c.req.valid('json');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // ユーザーメッセージを作成
    const chat = await ChatModel.createUserMessage(thread.id, user.id, content, c.env);
    
    // TODO: ここでLLMによる応答を生成する処理を追加
    // 現在は簡易的な応答を返す
    const assistantChat = await ChatModel.createAssistantMessage(
      thread.id,
      `ご要望を承りました。「${content}」について検討します。`,
      c.env
    );
    
    return c.json({ chat, assistantChat }, 201);
  } catch (error) {
    console.error('Create chat error:', error);
    return c.json({ error: 'Failed to create chat' }, 500);
  }
});

// LLMによるUI生成API
threadsRouter.post('/threads/:threadId/generate', authMiddleware, async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チャット履歴を取得
    const chats = await ChatModel.findByThreadId(thread.id, c.env);
    
    // TODO: ここでLLMによるUI生成処理を実装
    // 現在はモックレスポンスを返す
    const assistantChat = await ChatModel.createAssistantMessage(
      thread.id,
      `UIを生成しました。以下のコンポーネントを追加しました：
      1. ヘッダー（Header）
      2. ナビゲーションバー（NavBar）
      3. メインコンテンツエリア（MainContent）
      4. フッター（Footer）`,
      c.env
    );
    
    // TODO: 実際にはここでノードを作成する処理を追加
    
    return c.json({ 
      success: true, 
      message: 'UI generated successfully',
      assistantChat
    });
  } catch (error) {
    console.error('Generate UI error:', error);
    return c.json({ error: 'Failed to generate UI' }, 500);
  }
});

// LLMによるUI更新API
threadsRouter.post('/threads/:threadId/update', authMiddleware, async (c) => {
  const user = c.get('user');
  const threadId = c.req.param('threadId');
  
  try {
    // スレッドを取得
    const thread = await ThreadModel.findById(threadId, c.env);
    if (!thread) {
      return c.json({ error: 'Thread not found' }, 404);
    }
    
    // プロジェクトを取得
    const project = await ProjectModel.findById(thread.projectId, c.env);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    // ユーザーがプロジェクトにアクセスできるか確認
    if (project.teamId !== user.teamId && project.createdByUserId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チャット履歴を取得
    const chats = await ChatModel.findByThreadId(thread.id, c.env);
    
    // TODO: ここでLLMによるUI更新処理を実装
    // 現在はモックレスポンスを返す
    const assistantChat = await ChatModel.createAssistantMessage(
      thread.id,
      `UIを更新しました。以下の変更を適用しました：
      1. ヘッダーの色を変更
      2. ナビゲーションバーのリンクを追加
      3. メインコンテンツのレイアウトを調整`,
      c.env
    );
    
    // TODO: 実際にはここでノードを更新する処理を追加
    
    return c.json({ 
      success: true, 
      message: 'UI updated successfully',
      assistantChat
    });
  } catch (error) {
    console.error('Update UI error:', error);
    return c.json({ error: 'Failed to update UI' }, 500);
  }
});

export default threadsRouter;
