import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { SubscriptionModel } from '../../../models/subscription'
import { TeamModel } from '../../../models/team'
import { User } from '../../../models/user'
import { Env } from '../../../global'

// サブスクリプション作成用のスキーマ
const createSubscriptionSchema = z.object({
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
        planId: z.string().optional(),
        status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']).default('active'),
        teamId: z.string().uuid(),
})

// サブスクリプション関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// サブスクリプション作成API
app.post('/', zValidator('json', createSubscriptionSchema), async (c) => {
        const user = c.get('user')
        const data = c.req.valid('json')
        try {
                // チームを取得
                const team = await TeamModel.findById(data.teamId, c.env)
                if (!team) return c.json({ error: 'Team not found' }, 404)

                // ユーザーがチームのadminか確認
                if (user.teamId !== team.id || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 403)

                // チームに既存のサブスクリプションがあるか確認
                if (team.subscriptionId) return c.json({ error: 'Team already has a subscription' }, 400)

                // 新しいサブスクリプションを作成
                const subscription = await SubscriptionModel.create(
                        {
                                id: crypto.randomUUID(),
                                ...data,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        },
                        c.env
                )

                // チームのサブスクリプションIDを更新
                await TeamModel.update(team.id, { subscriptionId: subscription.id }, c.env)
                return c.json({ subscription }, 201)
        } catch (error) {
                console.error('Create subscription error:', error)
                return c.json({ error: 'Failed to create subscription' }, 500)
        }
})

export default app
