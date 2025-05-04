import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import * as schema from './schema'

// サブスクリプションのZodスキーマ
export const insertSubscriptionSchema = createInsertSchema(schema.subscriptions, {
        id: z.string().uuid(),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
        planId: z.string().optional(),
        status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']).optional(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
        canceledAt: z.string().datetime().optional(),
        currentPeriodEnd: z.string().datetime().optional(),
})

export const selectSubscriptionSchema = createSelectSchema(schema.subscriptions)

// チームのZodスキーマ
export const insertTeamSchema = createInsertSchema(schema.teams, {
        id: z.string().uuid(),
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        logoUrl: z.string().url().optional(),
        subscriptionId: z.string().uuid().optional(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
})

export const selectTeamSchema = createSelectSchema(schema.teams)

// ユーザーのZodスキーマ
export const insertUserSchema = createInsertSchema(schema.users, {
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
        emailVerified: z.date().optional().nullable(),
        teamId: z.string().uuid().optional(),
        role: z.enum(['admin', 'member']).default('member'),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
})

export const selectUserSchema = createSelectSchema(schema.users)

// プロジェクトのZodスキーマ
export const insertProjectSchema = createInsertSchema(schema.projects, {
        id: z.string().uuid(),
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        thumbnailUrl: z.string().url().optional(),
        teamId: z.string().uuid().optional(),
        createdByUserId: z.string().uuid(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
        lastAccessed: z.string().datetime().optional(),
})

export const selectProjectSchema = createSelectSchema(schema.projects)

// レイヤーのZodスキーマ
export const insertLayerSchema = createInsertSchema(schema.layers, {
        id: z.string().uuid(),
        projectId: z.string().uuid(),
        name: z.string().min(1).max(100),
        orderIndex: z.number().int().nonnegative(),
        isVisible: z.boolean().default(true),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
})

export const selectLayerSchema = createSelectSchema(schema.layers)

// スレッドのZodスキーマ
export const insertThreadSchema = createInsertSchema(schema.threads, {
        id: z.string().uuid(),
        projectId: z.string().uuid(),
        title: z.string().max(200).optional(),
        positionX: z.string().optional(),
        positionY: z.string().optional(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
})

export const selectThreadSchema = createSelectSchema(schema.threads)

// チャットのZodスキーマ
export const insertChatSchema = createInsertSchema(schema.chats, {
        id: z.string().uuid(),
        threadId: z.string().uuid(),
        userId: z.string().uuid().optional().nullable(), // null の場合は assistant
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        createdAt: z.string().datetime().optional(),
})

export const selectChatSchema = createSelectSchema(schema.chats)

// ノードのZodスキーマ
export const insertNodeSchema = createInsertSchema(schema.nodes, {
        id: z.string().uuid(),
        projectId: z.string().uuid(),
        layerId: z.string().uuid(),
        type: z.string(),
        name: z.string().min(1).max(100),
        properties: z.record(z.string(), z.any()).optional(),
        positionX: z.string().optional(),
        positionY: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        tailwindClasses: z.string().optional(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
        createdBy: z.string().optional(), // user_id または llm
})

export const selectNodeSchema = createSelectSchema(schema.nodes)

// エッジのZodスキーマ
export const insertEdgeSchema = createInsertSchema(schema.edges, {
        id: z.string().uuid(),
        projectId: z.string().uuid(),
        sourceNodeId: z.string().uuid(),
        targetNodeId: z.string().uuid(),
        type: z.string(),
        properties: z.record(z.string(), z.any()).optional(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
})

export const selectEdgeSchema = createSelectSchema(schema.edges)
