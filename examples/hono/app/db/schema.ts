import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';

// サブスクリプション（契約単位）テーブル
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  planId: text('plan_id'),
  status: text('status'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  canceledAt: text('canceled_at'),
  currentPeriodEnd: text('current_period_end'),
});

// チーム（組織）テーブル
export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  subscriptionId: text('subscription_id').references(() => subscriptions.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Auth.js用のユーザーテーブル
export const users = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'timestamp_ms' }),
  image: text('image'),
  teamId: text('team_id').references(() => teams.id),
  role: text('role').default('member'), // admin または member
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Auth.js用のアカウントテーブル
export const accounts = sqliteTable('account', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccount['type']>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

// Auth.js用のセッションテーブル
export const sessions = sqliteTable('session', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

// Auth.js用の検証トークンテーブル
export const verificationTokens = sqliteTable('verification_token', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({
    columns: [vt.identifier, vt.token],
  }),
}));

// プロジェクトテーブル
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  teamId: text('team_id').references(() => teams.id),
  createdByUserId: text('created_by_user_id').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  lastAccessed: text('last_accessed'),
});

// レイヤーテーブル
export const layers = sqliteTable('layers', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// スレッドテーブル
export const threads = sqliteTable('threads', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  title: text('title'),
  positionX: text('position_x'),
  positionY: text('position_y'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// チャットテーブル
export const chats = sqliteTable('chats', {
  id: text('id').primaryKey(),
  threadId: text('thread_id').references(() => threads.id).notNull(),
  userId: text('user_id').references(() => users.id), // null の場合は assistant
  role: text('role').notNull(), // user または assistant
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ノードテーブル（UI要素）
export const nodes = sqliteTable('nodes', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  layerId: text('layer_id').references(() => layers.id).notNull(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  properties: text('properties', { mode: 'json' }),
  positionX: text('position_x'),
  positionY: text('position_y'),
  width: text('width'),
  height: text('height'),
  tailwindClasses: text('tailwind_classes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'), // user_id または llm
});

// エッジテーブル（ノード間の関連）
export const edges = sqliteTable('edges', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  sourceNodeId: text('source_node_id').references(() => nodes.id).notNull(),
  targetNodeId: text('target_node_id').references(() => nodes.id).notNull(),
  type: text('type').notNull(),
  properties: text('properties', { mode: 'json' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
