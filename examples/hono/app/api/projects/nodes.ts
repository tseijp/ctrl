import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ProjectModel } from '../../models/project';
import { NodeModel } from '../../models/node';
import { User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// ノード関連のAPIルーター
const nodesRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// ノード作成用のスキーマ
const createNodeSchema = z.object({
  layerId: z.string().uuid(),
  type: z.string(),
  name: z.string().min(1).max(100),
  properties: z.record(z.string(), z.any()).optional(),
  positionX: z.string().optional(),
  positionY: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  tailwindClasses: z.string().optional(),
});

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
});

// プロジェクトのノード一覧取得API
nodesRouter.get('/:projectId/nodes', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const layerId = c.req.query('layerId');
  
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
    
    // ノード一覧を取得
    let nodes;
    if (layerId) {
      // レイヤーIDが指定されている場合は、そのレイヤーのノードのみを取得
      nodes = await NodeModel.findByLayerId(layerId, c.env);
    } else {
      // レイヤーIDが指定されていない場合は、プロジェクト全体のノードを取得
      nodes = await NodeModel.findByProjectId(projectId, c.env);
    }
    
    return c.json({ nodes });
  } catch (error) {
    console.error('Get nodes error:', error);
    return c.json({ error: 'Failed to get nodes' }, 500);
  }
});

// ノード作成API
nodesRouter.post('/:projectId/nodes', authMiddleware, zValidator('json', createNodeSchema), async (c) => {
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
    
    // 新しいノードを作成
    const node = await NodeModel.create({
      id: crypto.randomUUID(),
      projectId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id, // ユーザーIDを記録
    }, c.env);
    
    return c.json({ node }, 201);
  } catch (error) {
    console.error('Create node error:', error);
    return c.json({ error: 'Failed to create node' }, 500);
  }
});

// ノード詳細取得API
nodesRouter.get('/:projectId/nodes/:nodeId', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const nodeId = c.req.param('nodeId');
  
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
    
    // ノードを取得
    const node = await NodeModel.findById(nodeId, c.env);
    if (!node) {
      return c.json({ error: 'Node not found' }, 404);
    }
    
    // ノードがプロジェクトに属しているか確認
    if (node.projectId !== projectId) {
      return c.json({ error: 'Node does not belong to this project' }, 400);
    }
    
    return c.json({ node });
  } catch (error) {
    console.error('Get node error:', error);
    return c.json({ error: 'Failed to get node' }, 500);
  }
});

// ノード更新API
nodesRouter.put('/:projectId/nodes/:nodeId', authMiddleware, zValidator('json', updateNodeSchema), async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const nodeId = c.req.param('nodeId');
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
    
    // ノードを取得
    const node = await NodeModel.findById(nodeId, c.env);
    if (!node) {
      return c.json({ error: 'Node not found' }, 404);
    }
    
    // ノードがプロジェクトに属しているか確認
    if (node.projectId !== projectId) {
      return c.json({ error: 'Node does not belong to this project' }, 400);
    }
    
    // ノードを更新
    const updatedNode = await NodeModel.update(nodeId, data, c.env);
    if (!updatedNode) {
      return c.json({ error: 'Failed to update node' }, 500);
    }
    
    return c.json({ node: updatedNode });
  } catch (error) {
    console.error('Update node error:', error);
    return c.json({ error: 'Failed to update node' }, 500);
  }
});

// ノード削除API
nodesRouter.delete('/:projectId/nodes/:nodeId', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const nodeId = c.req.param('nodeId');
  
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
    
    // ノードを取得
    const node = await NodeModel.findById(nodeId, c.env);
    if (!node) {
      return c.json({ error: 'Node not found' }, 404);
    }
    
    // ノードがプロジェクトに属しているか確認
    if (node.projectId !== projectId) {
      return c.json({ error: 'Node does not belong to this project' }, 400);
    }
    
    // ノードを削除
    const success = await NodeModel.delete(nodeId, c.env);
    if (!success) {
      return c.json({ error: 'Failed to delete node' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete node error:', error);
    return c.json({ error: 'Failed to delete node' }, 500);
  }
});

export default nodesRouter;
