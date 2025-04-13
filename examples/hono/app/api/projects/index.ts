import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ProjectModel } from '../../models/project';
import { LayerModel } from '../../models/layer';
import { User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// プロジェクト関連のAPIルーター
const projectsRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// プロジェクト作成用のスキーマ
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional(),
});

// プロジェクト更新用のスキーマ
const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional(),
});

// レイヤー作成用のスキーマ
const createLayerSchema = z.object({
  name: z.string().min(1).max(100),
  isVisible: z.boolean().default(true),
});

// プロジェクト一覧取得API
projectsRouter.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  
  try {
    // ユーザーがアクセスできるプロジェクト一覧を取得
    const projects = await ProjectModel.findByUserAccess(user.id, user.teamId || null, c.env);
    
    return c.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Failed to get projects' }, 500);
  }
});

// プロジェクト作成API
projectsRouter.post('/', authMiddleware, zValidator('json', createProjectSchema), async (c) => {
  const user = c.get('user');
  const data = c.req.valid('json');
  
  try {
    // 新しいプロジェクトを作成
    const project = await ProjectModel.create({
      id: crypto.randomUUID(),
      ...data,
      teamId: user.teamId || undefined, // nullの場合はundefinedに変換
      createdByUserId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    }, c.env);
    
    // デフォルトレイヤーを作成
    const defaultLayer = await LayerModel.create({
      id: crypto.randomUUID(),
      projectId: project.id,
      name: 'Default Layer',
      orderIndex: 0,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    return c.json({ project, defaultLayer }, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// プロジェクト詳細取得API
projectsRouter.get('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('id');
  
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
    
    // プロジェクトの最終アクセス日時を更新
    await ProjectModel.updateLastAccessed(project.id, c.env);
    
    // レイヤー一覧を取得
    const layers = await LayerModel.findByProjectId(project.id, c.env);
    
    return c.json({ project, layers });
  } catch (error) {
    console.error('Get project error:', error);
    return c.json({ error: 'Failed to get project' }, 500);
  }
});

// プロジェクト更新API
projectsRouter.put('/:id', authMiddleware, zValidator('json', updateProjectSchema), async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('id');
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
    
    // プロジェクトを更新
    const updatedProject = await ProjectModel.update(project.id, data, c.env);
    if (!updatedProject) {
      return c.json({ error: 'Failed to update project' }, 500);
    }
    
    return c.json({ project: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// プロジェクト削除API
projectsRouter.delete('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('id');
  
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
    
    // プロジェクトを削除
    const success = await ProjectModel.delete(project.id, c.env);
    if (!success) {
      return c.json({ error: 'Failed to delete project' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// レイヤー一覧取得API
projectsRouter.get('/:id/layers', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('id');
  
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
    
    // レイヤー一覧を取得
    const layers = await LayerModel.findByProjectId(project.id, c.env);
    
    return c.json({ layers });
  } catch (error) {
    console.error('Get layers error:', error);
    return c.json({ error: 'Failed to get layers' }, 500);
  }
});

// レイヤー作成API
projectsRouter.post('/:id/layers', authMiddleware, zValidator('json', createLayerSchema), async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('id');
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
    
    // 新しいレイヤーを作成
    const layer = await LayerModel.create({
      id: crypto.randomUUID(),
      projectId: project.id,
      ...data,
      orderIndex: 0, // デフォルトは0、LayerModelで自動的に最大値+1に設定される
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    return c.json({ layer }, 201);
  } catch (error) {
    console.error('Create layer error:', error);
    return c.json({ error: 'Failed to create layer' }, 500);
  }
});

export default projectsRouter;
