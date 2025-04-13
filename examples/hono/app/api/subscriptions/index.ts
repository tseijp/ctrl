import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { SubscriptionModel } from '../../models/subscription';
import { TeamModel } from '../../models/team';
import { User } from '../../models/user';
import { authMiddleware } from '../../auth/middleware';
import { Env } from '../../global';

// サブスクリプション関連のAPIルーター
const subscriptionsRouter = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

// サブスクリプション作成用のスキーマ
const createSubscriptionSchema = z.object({
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  planId: z.string().optional(),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']).default('active'),
  teamId: z.string().uuid(),
});

// サブスクリプション更新用のスキーマ
const updateSubscriptionSchema = z.object({
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  planId: z.string().optional(),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']).optional(),
  currentPeriodEnd: z.string().datetime().optional(),
});

// サブスクリプション詳細取得API
subscriptionsRouter.get('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const subscriptionId = c.req.param('id');
  
  try {
    // サブスクリプションを取得
    const subscription = await SubscriptionModel.findById(subscriptionId, c.env);
    if (!subscription) {
      return c.json({ error: 'Subscription not found' }, 404);
    }
    
    // チームを取得
    const team = await TeamModel.findBySubscriptionId(subscription.id, c.env);
    if (!team) {
      return c.json({ error: 'Team not found for this subscription' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    return c.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    return c.json({ error: 'Failed to get subscription' }, 500);
  }
});

// サブスクリプション作成API
subscriptionsRouter.post('/', authMiddleware, zValidator('json', createSubscriptionSchema), async (c) => {
  const user = c.get('user');
  const data = c.req.valid('json');
  
  try {
    // チームを取得
    const team = await TeamModel.findById(data.teamId, c.env);
    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // チームに既存のサブスクリプションがあるか確認
    if (team.subscriptionId) {
      return c.json({ error: 'Team already has a subscription' }, 400);
    }
    
    // 新しいサブスクリプションを作成
    const subscription = await SubscriptionModel.create({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, c.env);
    
    // チームのサブスクリプションIDを更新
    await TeamModel.update(team.id, { subscriptionId: subscription.id }, c.env);
    
    return c.json({ subscription }, 201);
  } catch (error) {
    console.error('Create subscription error:', error);
    return c.json({ error: 'Failed to create subscription' }, 500);
  }
});

// サブスクリプション更新API
subscriptionsRouter.put('/:id', authMiddleware, zValidator('json', updateSubscriptionSchema), async (c) => {
  const user = c.get('user');
  const subscriptionId = c.req.param('id');
  const data = c.req.valid('json');
  
  try {
    // サブスクリプションを取得
    const subscription = await SubscriptionModel.findById(subscriptionId, c.env);
    if (!subscription) {
      return c.json({ error: 'Subscription not found' }, 404);
    }
    
    // チームを取得
    const team = await TeamModel.findBySubscriptionId(subscription.id, c.env);
    if (!team) {
      return c.json({ error: 'Team not found for this subscription' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // サブスクリプションを更新
    const updatedSubscription = await SubscriptionModel.update(subscription.id, data, c.env);
    if (!updatedSubscription) {
      return c.json({ error: 'Failed to update subscription' }, 500);
    }
    
    return c.json({ subscription: updatedSubscription });
  } catch (error) {
    console.error('Update subscription error:', error);
    return c.json({ error: 'Failed to update subscription' }, 500);
  }
});

// サブスクリプションキャンセルAPI
subscriptionsRouter.post('/:id/cancel', authMiddleware, async (c) => {
  const user = c.get('user');
  const subscriptionId = c.req.param('id');
  
  try {
    // サブスクリプションを取得
    const subscription = await SubscriptionModel.findById(subscriptionId, c.env);
    if (!subscription) {
      return c.json({ error: 'Subscription not found' }, 404);
    }
    
    // チームを取得
    const team = await TeamModel.findBySubscriptionId(subscription.id, c.env);
    if (!team) {
      return c.json({ error: 'Team not found for this subscription' }, 404);
    }
    
    // ユーザーがチームのadminか確認
    if (user.teamId !== team.id || user.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // サブスクリプションをキャンセル
    const canceledSubscription = await SubscriptionModel.cancel(subscription.id, c.env);
    if (!canceledSubscription) {
      return c.json({ error: 'Failed to cancel subscription' }, 500);
    }
    
    return c.json({ subscription: canceledSubscription });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
});

export default subscriptionsRouter;
