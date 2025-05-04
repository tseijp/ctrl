import { eq, and } from 'drizzle-orm'
import { getDb } from '../db'
import { projects } from '../db/schema'
import { insertProjectSchema, selectProjectSchema } from '../db/schema-validation'
import { z } from 'zod'
import { Env } from '../global'

// プロジェクトモデルのインターフェース
export interface Project {
        id: string
        name: string
        description?: string | null
        thumbnailUrl?: string | null
        teamId?: string | null
        createdByUserId: string | null
        createdAt?: string | null
        updatedAt?: string | null
        lastAccessed?: string | null
}

// プロジェクト作成用の入力データ型
export type ProjectCreateInput = z.infer<typeof insertProjectSchema>

// プロジェクトモデルクラス
export class ProjectModel {
        // プロジェクトをIDで取得
        static async findById(id: string, env?: Env): Promise<Project | null> {
                const db = getDb(env)
                const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // チームのプロジェクト一覧を取得
        static async findByTeamId(teamId: string, env?: Env): Promise<Project[]> {
                const db = getDb(env)
                const result = await db.select().from(projects).where(eq(projects.teamId, teamId))
                return result
        }

        // ユーザーが作成したプロジェクト一覧を取得
        static async findByCreatedByUserId(userId: string, env?: Env): Promise<Project[]> {
                const db = getDb(env)
                const result = await db.select().from(projects).where(eq(projects.createdByUserId, userId))
                return result
        }

        // ユーザーがアクセスできるプロジェクト一覧を取得（チームのプロジェクトと自分が作成したプロジェクト）
        static async findByUserAccess(userId: string, teamId: string | null, env?: Env): Promise<Project[]> {
                const db = getDb(env)

                if (teamId) {
                        // チームに所属している場合は、チームのプロジェクトと自分が作成したプロジェクトを取得
                        const result = await db
                                .select()
                                .from(projects)
                                .where(and(eq(projects.teamId, teamId), eq(projects.createdByUserId, userId)))
                        return result
                } else {
                        // チームに所属していない場合は、自分が作成したプロジェクトのみを取得
                        return await ProjectModel.findByCreatedByUserId(userId, env)
                }
        }

        // 新しいプロジェクトを作成
        static async create(data: ProjectCreateInput, env?: Env): Promise<Project> {
                const db = getDb(env)
                const result = await db.insert(projects).values(data).returning()
                return result[0]
        }

        // プロジェクト情報を更新
        static async update(id: string, data: Partial<ProjectCreateInput>, env?: Env): Promise<Project | null> {
                const db = getDb(env)
                const result = await db
                        .update(projects)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(projects.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // プロジェクトの最終アクセス日時を更新
        static async updateLastAccessed(id: string, env?: Env): Promise<Project | null> {
                const db = getDb(env)
                const result = await db
                        .update(projects)
                        .set({
                                lastAccessed: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(projects.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // プロジェクトを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(projects).where(eq(projects.id, id)).returning()
                return result.length > 0
        }
}
