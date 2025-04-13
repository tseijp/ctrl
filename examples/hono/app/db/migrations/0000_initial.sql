-- SQLite用の初期マイグレーションファイル

-- サブスクリプション（契約単位）テーブル
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" TEXT PRIMARY KEY,
  "stripe_customer_id" TEXT,
  "stripe_subscription_id" TEXT,
  "plan_id" TEXT,
  "status" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "canceled_at" TEXT,
  "current_period_end" TEXT
);

-- チーム（組織）テーブル
CREATE TABLE IF NOT EXISTS "teams" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "logo_url" TEXT,
  "subscription_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id")
);

-- Auth.js用のユーザーテーブル
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "email_verified" INTEGER,
  "image" TEXT,
  "team_id" TEXT,
  "role" TEXT DEFAULT 'member',
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("team_id") REFERENCES "teams" ("id")
);

-- Auth.js用のアカウントテーブル
CREATE TABLE IF NOT EXISTS "account" (
  "provider" TEXT NOT NULL,
  "provider_account_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  PRIMARY KEY ("provider", "provider_account_id"),
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Auth.js用のセッションテーブル
CREATE TABLE IF NOT EXISTS "session" (
  "session_token" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "expires" INTEGER NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Auth.js用の検証トークンテーブル
CREATE TABLE IF NOT EXISTS "verification_token" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" INTEGER NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- プロジェクトテーブル
CREATE TABLE IF NOT EXISTS "projects" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail_url" TEXT,
  "team_id" TEXT,
  "created_by_user_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "last_accessed" TEXT,
  FOREIGN KEY ("team_id") REFERENCES "teams" ("id"),
  FOREIGN KEY ("created_by_user_id") REFERENCES "user" ("id")
);

-- レイヤーテーブル
CREATE TABLE IF NOT EXISTS "layers" (
  "id" TEXT PRIMARY KEY,
  "project_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "order_index" INTEGER NOT NULL,
  "is_visible" INTEGER DEFAULT 1,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("project_id") REFERENCES "projects" ("id")
);

-- スレッドテーブル
CREATE TABLE IF NOT EXISTS "threads" (
  "id" TEXT PRIMARY KEY,
  "project_id" TEXT NOT NULL,
  "title" TEXT,
  "position_x" TEXT,
  "position_y" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("project_id") REFERENCES "projects" ("id")
);

-- チャットテーブル
CREATE TABLE IF NOT EXISTS "chats" (
  "id" TEXT PRIMARY KEY,
  "thread_id" TEXT NOT NULL,
  "user_id" TEXT,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("thread_id") REFERENCES "threads" ("id"),
  FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

-- ノードテーブル（UI要素）
CREATE TABLE IF NOT EXISTS "nodes" (
  "id" TEXT PRIMARY KEY,
  "project_id" TEXT NOT NULL,
  "layer_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "properties" TEXT,
  "position_x" TEXT,
  "position_y" TEXT,
  "width" TEXT,
  "height" TEXT,
  "tailwind_classes" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "created_by" TEXT,
  FOREIGN KEY ("project_id") REFERENCES "projects" ("id"),
  FOREIGN KEY ("layer_id") REFERENCES "layers" ("id")
);

-- エッジテーブル（ノード間の関連）
CREATE TABLE IF NOT EXISTS "edges" (
  "id" TEXT PRIMARY KEY,
  "project_id" TEXT NOT NULL,
  "source_node_id" TEXT NOT NULL,
  "target_node_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "properties" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("project_id") REFERENCES "projects" ("id"),
  FOREIGN KEY ("source_node_id") REFERENCES "nodes" ("id"),
  FOREIGN KEY ("target_node_id") REFERENCES "nodes" ("id")
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS "idx_teams_subscription_id" ON "teams" ("subscription_id");
CREATE INDEX IF NOT EXISTS "idx_users_team_id" ON "user" ("team_id");
CREATE INDEX IF NOT EXISTS "idx_projects_team_id" ON "projects" ("team_id");
CREATE INDEX IF NOT EXISTS "idx_projects_created_by_user_id" ON "projects" ("created_by_user_id");
CREATE INDEX IF NOT EXISTS "idx_layers_project_id" ON "layers" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_threads_project_id" ON "threads" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_chats_thread_id" ON "chats" ("thread_id");
CREATE INDEX IF NOT EXISTS "idx_chats_user_id" ON "chats" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_nodes_project_id" ON "nodes" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_nodes_layer_id" ON "nodes" ("layer_id");
CREATE INDEX IF NOT EXISTS "idx_edges_project_id" ON "edges" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_edges_source_node_id" ON "edges" ("source_node_id");
CREATE INDEX IF NOT EXISTS "idx_edges_target_node_id" ON "edges" ("target_node_id");
