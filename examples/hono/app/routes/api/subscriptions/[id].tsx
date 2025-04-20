import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { SubscriptionModel } from '../../../models/subscription'
import { TeamModel } from '../../../models/team'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// サブスクリプション更新用のスキーマ
const updateSubscriptionSchema = z.object({
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
        planId: z.string().optional(),
        status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']).optional(),
        currentPeriodEnd: z.string().datetime().optional(),
})

// サブスクリプション関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// サブスクリプション詳細取得API
app.get('/', async (c) => {
        const user = c.get('user')
        const subscriptionId = c.req.param('id')
        if (!subscriptionId) return c.json({ error: 'Subscription ID is required' }, 400)
        try {
                // サブスクリプションを取得
                const subscription = await SubscriptionModel.findById(subscriptionId, c.env)
                if (!subscription) return c.json({ error: 'Subscription not found' }, 404)

                // チームを取得
                const team = await TeamModel.findBySubscriptionId(subscription.id, c.env)
                if (!team) return c.json({ error: 'Team not found for this subscription' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                return c.json({ subscription })
        } catch (error) {
                console.error('Get subscription error:', error)
                return c.json({ error: 'Failed to get subscription' }, 500)
        }
})

// サブスクリプション更新API
app.put('/', zValidator('json', updateSubscriptionSchema), async (c) => {
        const user = c.get('user')
        const subscriptionId = c.req.param('id')
        const data = c.req.valid('json')
        if (!subscriptionId) return c.json({ error: 'Subscription ID is required' }, 400)
        try {
                // サブスクリプションを取得
                const subscription = await SubscriptionModel.findById(subscriptionId, c.env)
                if (!subscription) return c.json({ error: 'Subscription not found' }, 404)

                // チームを取得
                const team = await TeamModel.findBySubscriptionId(subscription.id, c.env)
                if (!team) return c.json({ error: 'Team not found for this subscription' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                // サブスクリプションを更新
                const updatedSubscription = await SubscriptionModel.update(subscription.id, data, c.env)
                if (!updatedSubscription) return c.json({ error: 'Failed to update subscription' }, 500)

                return c.json({ subscription: updatedSubscription })
        } catch (error) {
                console.error('Update subscription error:', error)
                return c.json({ error: 'Failed to update subscription' }, 500)
        }
})

export default app
