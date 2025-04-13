import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { UserModel, User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// 認証関連のAPIルーター
const authRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// プロフィール更新用のスキーマ
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
});

// ユーザー情報取得API
authRouter.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({ user });
});

// プロフィール更新API
authRouter.put('/profile', authMiddleware, zValidator('json', profileUpdateSchema), async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const data = c.req.valid('json');
  
  try {
    const updatedUser = await UserModel.update(user.id, data, c.env);
    if (!updatedUser) {
      return c.json({ error: 'Failed to update profile' }, 500);
    }
    
    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// 注意: 以下のAPIはAuth.jsで実装されているため、ここでは実装しません
// - POST /api/auth/register (Google認証で実装)
// - POST /api/auth/login (Google認証で実装)
// - POST /api/auth/logout (Google認証で実装)

export default authRouter;
