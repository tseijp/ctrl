import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ProjectModel } from '../../models/project';
import { NodeModel } from '../../models/node';
import { EdgeModel } from '../../models/edge';
import { User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// エッジ関連のAPIルーター
const edgesRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// エッジ作成用のスキーマ
const createEdgeSchema = z.object({
  sourceNodeId: z.string().uuid(),
  targetNodeId: z.string().uuid(),
  type: z.string(),
  properties: z.record(z.string(), z.any()).optional(),
});

// エッジ更新用のスキーマ
const updateEdgeSchema = z.object({
  type: z.string().optional(),
  properties: z.record(z.string(), z.any()).optional(),
  sourceNodeId: z.string().uuid().optional(),
  targetNodeId: z.string().uuid().optional(),
});

// プロジェクトのエッジ一覧取得API
edgesRouter.get('/:projectId/edges', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const nodeId = c.req.query('nodeId'); // 特定のノードに関連するエッジのみを取得する場合
  
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
    
    // エッジ一覧を取得
    let edges;
    if (nodeId) {
      // ノードIDが指定されている場合は、そのノードに関連するエッジのみを取得
      edges = await EdgeModel.findByNodeId(nodeId, c.env);
    } else {
      // ノードIDが指定されていない場合は、プロジェクト全体のエッジを取得
      edges = await EdgeModel.findByProjectId(projectId, c.env);
    }
    
    return c.json({ edges });
  } catch (error) {
    console.error('Get edges error:', error);
    return c.json({ error: 'Failed to get edges' }, 500);
  }
});

// エッジ作成API
edgesRouter.post('/:projectId/edges', authMiddleware, zValidator('json', createEdgeSchema), async (c) => {
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
    
    // ソースノードとターゲットノードが存在するか確認
    const [sourceNode, targetNode] = await Promise.all([
      NodeModel.findById(data.sourceNodeId, c.env),
      NodeModel.findById(data.targetNodeId, c.env)
    ]);
    
    if (!sourceNode) {
      return c.json({ error: 'Source node not found' }, 404);
    }
    
    if (!targetNode) {
      return c.json({ error: 'Target node not found' }, 404);
    }
    
    // ノードがプロジェクトに属しているか確認
    if (sourceNode.projectId !== projectId || targetNode.projectId !== projectId) {
      return c.json({ error: 'Nodes do not belong to this project' }, 400);
    }
    
    // 新しいエッジを作成
    const edge = await EdgeModel.create({
      id: crypto.randomUUID(),
      projectId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    return c.json({ edge }, 201);
  } catch (error) {
    console.error('Create edge error:', error);
    return c.json({ error: 'Failed to create edge' }, 500);
  }
});

// エッジ詳細取得API
edgesRouter.get('/:projectId/edges/:edgeId', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const edgeId = c.req.param('edgeId');
  
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
    
    // エッジを取得
    const edge = await EdgeModel.findById(edgeId, c.env);
    if (!edge) {
      return c.json({ error: 'Edge not found' }, 404);
    }
    
    // エッジがプロジェクトに属しているか確認
    if (edge.projectId !== projectId) {
      return c.json({ error: 'Edge does not belong to this project' }, 400);
    }
    
    return c.json({ edge });
  } catch (error) {
    console.error('Get edge error:', error);
    return c.json({ error: 'Failed to get edge' }, 500);
  }
});

// エッジ更新API
edgesRouter.put('/:projectId/edges/:edgeId', authMiddleware, zValidator('json', updateEdgeSchema), async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const edgeId = c.req.param('edgeId');
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
    
    // エッジを取得
    const edge = await EdgeModel.findById(edgeId, c.env);
    if (!edge) {
      return c.json({ error: 'Edge not found' }, 404);
    }
    
    // エッジがプロジェクトに属しているか確認
    if (edge.projectId !== projectId) {
      return c.json({ error: 'Edge does not belong to this project' }, 400);
    }
    
    // ソースノードまたはターゲットノードが変更される場合、存在確認
    if (data.sourceNodeId || data.targetNodeId) {
      const sourceNodeId = data.sourceNodeId || edge.sourceNodeId;
      const targetNodeId = data.targetNodeId || edge.targetNodeId;
      
      const [sourceNode, targetNode] = await Promise.all([
        NodeModel.findById(sourceNodeId, c.env),
        NodeModel.findById(targetNodeId, c.env)
      ]);
      
      if (!sourceNode) {
        return c.json({ error: 'Source node not found' }, 404);
      }
      
      if (!targetNode) {
        return c.json({ error: 'Target node not found' }, 404);
      }
      
      // ノードがプロジェクトに属しているか確認
      if (sourceNode.projectId !== projectId || targetNode.projectId !== projectId) {
        return c.json({ error: 'Nodes do not belong to this project' }, 400);
      }
    }
    
    // エッジを更新
    const updatedEdge = await EdgeModel.update(edgeId, data, c.env);
    if (!updatedEdge) {
      return c.json({ error: 'Failed to update edge' }, 500);
    }
    
    return c.json({ edge: updatedEdge });
  } catch (error) {
    console.error('Update edge error:', error);
    return c.json({ error: 'Failed to update edge' }, 500);
  }
});

// エッジ削除API
edgesRouter.delete('/:projectId/edges/:edgeId', authMiddleware, async (c) => {
  const user = c.get('user');
  const projectId = c.req.param('projectId');
  const edgeId = c.req.param('edgeId');
  
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
    
    // エッジを取得
    const edge = await EdgeModel.findById(edgeId, c.env);
    if (!edge) {
      return c.json({ error: 'Edge not found' }, 404);
    }
    
    // エッジがプロジェクトに属しているか確認
    if (edge.projectId !== projectId) {
      return c.json({ error: 'Edge does not belong to this project' }, 400);
    }
    
    // エッジを削除
    const success = await EdgeModel.delete(edgeId, c.env);
    if (!success) {
      return c.json({ error: 'Failed to delete edge' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete edge error:', error);
    return c.json({ error: 'Failed to delete edge' }, 500);
  }
});

export default edgesRouter;
