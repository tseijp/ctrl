import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { subscriptions } from '../db/schema'
import { insertSubscriptionSchema, selectSubscriptionSchema } from '../db/schema-validation'
import { z } from 'zod'
import { Env } from '../global'

// サブスクリプションモデルのインターフェース
export interface Subscription {
        id: string
        stripeCustomerId?: string | null
        stripeSubscriptionId?: string | null
        planId?: string | null
        status?: string | null
        createdAt?: string | null
        updatedAt?: string | null
        canceledAt?: string | null
        currentPeriodEnd?: string | null
}

// サブスクリプション作成用の入力データ型
export type SubscriptionCreateInput = z.infer<typeof insertSubscriptionSchema>

// サブスクリプションモデルクラス
export class SubscriptionModel {
        // サブスクリプションをIDで取得
        static async findById(id: string, env?: Env): Promise<Subscription | null> {
                const db = getDb(env)
                const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // Stripe顧客IDでサブスクリプションを取得
        static async findByStripeCustomerId(stripeCustomerId: string, env?: Env): Promise<Subscription | null> {
                const db = getDb(env)
                const result = await db
                        .select()
                        .from(subscriptions)
                        .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
                        .limit(1)
                return result.length > 0 ? result[0] : null
        }

        // StripeサブスクリプションIDでサブスクリプションを取得
        static async findByStripeSubscriptionId(stripeSubscriptionId: string, env?: Env): Promise<Subscription | null> {
                const db = getDb(env)
                const result = await db
                        .select()
                        .from(subscriptions)
                        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
                        .limit(1)
                return result.length > 0 ? result[0] : null
        }

        // 新しいサブスクリプションを作成
        static async create(data: SubscriptionCreateInput, env?: Env): Promise<Subscription> {
                const db = getDb(env)
                const result = await db.insert(subscriptions).values(data).returning()
                return result[0]
        }

        // サブスクリプション情報を更新
        static async update(
                id: string,
                data: Partial<SubscriptionCreateInput>,
                env?: Env
        ): Promise<Subscription | null> {
                const db = getDb(env)
                const result = await db
                        .update(subscriptions)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(subscriptions.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // サブスクリプションをキャンセル
        static async cancel(id: string, env?: Env): Promise<Subscription | null> {
                const db = getDb(env)
                const result = await db
                        .update(subscriptions)
                        .set({
                                status: 'canceled',
                                canceledAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(subscriptions.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // サブスクリプションを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning()
                return result.length > 0
        }

        // Stripeからのイベントでサブスクリプションを更新
        static async syncFromStripeEvent(event: any, env?: Env): Promise<Subscription | null> {
                const db = getDb(env)
                const stripeSubscription = event.data.object

                // 既存のサブスクリプションを検索
                const existingSubscription = await SubscriptionModel.findByStripeSubscriptionId(
                        stripeSubscription.id,
                        env
                )

                if (existingSubscription) {
                        // 既存のサブスクリプションを更新
                        return await SubscriptionModel.update(
                                existingSubscription.id,
                                {
                                        status: stripeSubscription.status,
                                        currentPeriodEnd: new Date(
                                                stripeSubscription.current_period_end * 1000
                                        ).toISOString(),
                                        updatedAt: new Date().toISOString(),
                                },
                                env
                        )
                } else if (stripeSubscription.customer) {
                        // 顧客IDで検索
                        const customerSubscription = await SubscriptionModel.findByStripeCustomerId(
                                stripeSubscription.customer,
                                env
                        )

                        if (customerSubscription) {
                                // 既存の顧客サブスクリプションを更新
                                return await SubscriptionModel.update(
                                        customerSubscription.id,
                                        {
                                                stripeSubscriptionId: stripeSubscription.id,
                                                status: stripeSubscription.status,
                                                currentPeriodEnd: new Date(
                                                        stripeSubscription.current_period_end * 1000
                                                ).toISOString(),
                                                updatedAt: new Date().toISOString(),
                                        },
                                        env
                                )
                        } else {
                                // 新規サブスクリプションを作成
                                return await SubscriptionModel.create(
                                        {
                                                id: crypto.randomUUID(),
                                                stripeCustomerId: stripeSubscription.customer,
                                                stripeSubscriptionId: stripeSubscription.id,
                                                status: stripeSubscription.status,
                                                currentPeriodEnd: new Date(
                                                        stripeSubscription.current_period_end * 1000
                                                ).toISOString(),
                                                createdAt: new Date().toISOString(),
                                                updatedAt: new Date().toISOString(),
                                        },
                                        env
                                )
                        }
                }

                return null
        }
}
