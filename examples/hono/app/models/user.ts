import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { users } from '../db/schema'
import { insertUserSchema, selectUserSchema } from '../db/schema-validation'
import { z } from 'zod'
import { Env } from '../global'

// ユーザーモデルのインターフェース（アプリケーション用）
export interface User {
        id: string
        email: string
        name: string | null
        image?: string | null
        emailVerified?: Date | number | null
        teamId?: string | null
        role: string | null
        createdAt: string | null
        updatedAt: string | null
}

// ユーザー作成用の入力データ型
export type UserCreateInput = z.infer<typeof insertUserSchema>

// ユーザーモデルクラス
export class UserModel {
        // ユーザーをIDで取得
        static async findById(id: string, env?: Env): Promise<User | null> {
                const db = getDb(env)
                const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // ユーザーをメールアドレスで取得
        static async findByEmail(email: string, env?: Env): Promise<User | null> {
                const db = getDb(env)
                const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // チームに所属するユーザーを取得
        static async findByTeamId(teamId: string, env?: Env): Promise<User[]> {
                const db = getDb(env)
                const result = await db.select().from(users).where(eq(users.teamId, teamId))
                return result
        }

        // 新しいユーザーを作成
        static async create(data: UserCreateInput, env?: Env): Promise<User> {
                const db = getDb(env)
                const result = await db.insert(users).values(data).returning()
                return result[0]
        }

        // ユーザー情報を更新
        static async update(id: string, data: Partial<UserCreateInput>, env?: Env): Promise<User | null> {
                const db = getDb(env)
                const result = await db
                        .update(users)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(users.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // ユーザーを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(users).where(eq(users.id, id)).returning()
                return result.length > 0
        }

        // Auth.jsのユーザーからアプリケーションユーザーを作成/更新
        static async syncFromAuthUser(authUser: any, env?: Env): Promise<User> {
                const db = getDb(env)

                // 既存ユーザーを検索
                const existingUser = await UserModel.findById(authUser.id, env)

                if (existingUser) {
                        // 既存ユーザーを更新
                        const updatedUser = await UserModel.update(
                                authUser.id,
                                {
                                        name: authUser.name,
                                        email: authUser.email,
                                        image: authUser.image,
                                        emailVerified: authUser.emailVerified ? new Date(authUser.emailVerified) : null,
                                        updatedAt: new Date().toISOString(),
                                },
                                env
                        )
                        return updatedUser!
                } else {
                        // 新規ユーザーを作成
                        const newUser = await UserModel.create(
                                {
                                        id: authUser.id,
                                        name: authUser.name,
                                        email: authUser.email,
                                        image: authUser.image,
                                        emailVerified: authUser.emailVerified ? new Date(authUser.emailVerified) : null,
                                        role: 'member',
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                },
                                env
                        )
                        return newUser
                }
        }
}
