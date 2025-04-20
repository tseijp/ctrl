import { Hono } from 'hono'
import { SubscriptionModel } from '../../../../../models/subscription'
import { TeamModel } from '../../../../../models/team'
import { User } from '../../../../../models/user'
import { Env } from '../../../../../global'

// サブスクリプション関連のAPIルーター
const app = new Hono<{
        Bindings: Env
        Variables: {
                user: User
        }
}>()

// サブスクリプションキャンセルAPI
app.post('/', async (c) => {
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

                // サブスクリプションをキャンセル
                const canceledSubscription = await SubscriptionModel.cancel(subscription.id, c.env)
                if (!canceledSubscription) return c.json({ error: 'Failed to cancel subscription' }, 500)

                return c.json({ subscription: canceledSubscription })
        } catch (error) {
                console.error('Cancel subscription error:', error)
                return c.json({ error: 'Failed to cancel subscription' }, 500)
        }
})

export default app
