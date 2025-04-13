import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { TeamModel } from '../../models/team';
import { UserModel, User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// チーム関連のAPIルーター
const teamsRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// チーム作成用のスキーマ
const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

// チーム更新用のスキーマ
const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

// チームメンバー追加用のスキーマ
const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'member']).default('member'),
});

// チーム一覧取得API
teamsRouter.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  
  try {
    // ユーザーが所属しているチームを取得
    const team = user.teamId ? await TeamModel.findById(user.teamId, c.env) : null;
    
    // ユーザーがadminの場合は、そのチームを返す
    if (team && user.role === 'admin') {
      return c.json({ teams: [team] });
    }
    
    // ユーザーがmemberの場合は、そのチームのみ返す
    if (team) {
      return c.json({ teams: [team] });
    }
    
    // チームに所属していない場合は空配列を返す
    return c.json({ teams: [] });
  } catch (error) {
    console.error('Get teams error:', error);
    return c.json({ error: 'Failed to get teams' }, 500);
  }
});

// チーム作成API
teamsRouter.post('/', authMiddleware, zValidator('json', createTeamSchema), async (c) => {
  const user = c.get('user');
  const data = c.req.valid('json');
  
  try {
    // 新しいチームを作成
    const team = await TeamModel.create({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    // ユーザーをチームに追加（admin権限で）
    await TeamModel.addMember(team.id, user.id, 'admin', c.env);
    
    return c.json({ team }, 201);
  } catch (error) {
    console.error('Create team error:', error);
    return c.json({ error: 'Failed to create team' }, 500);
  }
});

// チーム詳細取得API
teamsRouter.get('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const teamId = c.req.param('id');
  
  try {
    // チームを取得
    const team = await TeamModel.findById(teamId, c.env);
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // ユーザーがチームに所属しているか確認
    if (user.teamId !== team.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チームメンバー一覧を取得
    const members = await TeamModel.getMembers(team.id, c.env);
    
    return c.json({ team, members });
  } catch (error) {
    console.error('Get team error:', error);
    return c.json({ error: 'Failed to get team' }, 500);
  }
});

// チーム更新API
teamsRouter.put('/:id', authMiddleware, zValidator('json', updateTeamSchema), async (c) => {
  const user = c.get('user');
  const teamId = c.req.param('id');
  const data = c.req.valid('json');
  
  try {
    // チームを取得
    const team = await TeamModel.findById(teamId, c.env);
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チームを更新
    const updatedTeam = await TeamModel.update(team.id, data, c.env);
    if (!updatedTeam) {
      return c.json({ error: 'Failed to update team' }, 500);
    }
    
    return c.json({ team: updatedTeam });
  } catch (error) {
    console.error('Update team error:', error);
    return c.json({ error: 'Failed to update team' }, 500);
  }
});

// チームメンバー追加API
teamsRouter.post('/:id/members', authMiddleware, zValidator('json', addMemberSchema), async (c) => {
  const user = c.get('user');
  const teamId = c.req.param('id');
  const { userId, role } = c.req.valid('json');
  
  try {
    // チームを取得
    const team = await TeamModel.findById(teamId, c.env);
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // 追加するユーザーを取得
    const memberToAdd = await UserModel.findById(userId, c.env);
    if (!memberToAdd) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // ユーザーをチームに追加
    const updatedMember = await TeamModel.addMember(team.id, userId, role, c.env);
    if (!updatedMember) {
      return c.json({ error: 'Failed to add member' }, 500);
    }
    
    return c.json({ member: updatedMember });
  } catch (error) {
    console.error('Add member error:', error);
    return c.json({ error: 'Failed to add member' }, 500);
  }
});

// チームメンバー削除API
teamsRouter.delete('/:id/members/:userId', authMiddleware, async (c) => {
  const user = c.get('user');
  const teamId = c.req.param('id');
  const memberIdToRemove = c.req.param('userId');
  
  try {
    // チームを取得
    const team = await TeamModel.findById(teamId, c.env);
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // 自分自身を削除しようとしていないか確認
    if (memberIdToRemove === user.id) {
      return c.json({ error: 'Cannot remove yourself from the team' }, 400);
    }
    
    // ユーザーをチームから削除
    const success = await TeamModel.removeMember(team.id, memberIdToRemove, c.env);
    if (!success) {
      return c.json({ error: 'Failed to remove member' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Remove member error:', error);
    return c.json({ error: 'Failed to remove member' }, 500);
  }
});

export default teamsRouter;
