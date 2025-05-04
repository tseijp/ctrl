import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { threads } from '../db/schema'
import { insertThreadSchema } from '../db/valid'
import { z } from 'zod'
import { Env } from '../global'

// スレッドモデルのインターフェース
export interface Thread {
        id: string
        projectId: string
        title?: string | null
        positionX?: string | null
        positionY?: string | null
        createdAt?: string | null
        updatedAt?: string | null
}

// スレッド作成用の入力データ型
export type ThreadCreateInput = z.infer<typeof insertThreadSchema>

// スレッドモデルクラス
export class ThreadModel {
        // スレッドをIDで取得
        static async findById(id: string, env?: Env): Promise<Thread | null> {
                const db = getDb(env)
                const result = await db.select().from(threads).where(eq(threads.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // プロジェクトのスレッド一覧を取得
        static async findByProjectId(projectId: string, env?: Env): Promise<Thread[]> {
                const db = getDb(env)
                const result = await db.select().from(threads).where(eq(threads.projectId, projectId))

                // 結果を作成日時の降順でソート
                return result.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return dateB - dateA // 降順（新しい順）
                })
        }

        // 新しいスレッドを作成
        static async create(data: ThreadCreateInput, env?: Env): Promise<Thread> {
                const db = getDb(env)
                const result = await db.insert(threads).values(data).returning()

                return result[0]
        }

        // スレッド情報を更新
        static async update(
                id: string,
                data: Partial<Omit<ThreadCreateInput, 'projectId'>>,
                env?: Env
        ): Promise<Thread | null> {
                const db = getDb(env)
                const result = await db
                        .update(threads)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(threads.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // スレッドの位置を更新
        static async updatePosition(
                id: string,
                positionX: string,
                positionY: string,
                env?: Env
        ): Promise<Thread | null> {
                const db = getDb(env)
                const result = await db
                        .update(threads)
                        .set({
                                positionX,
                                positionY,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(threads.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // スレッドのタイトルを更新
        static async updateTitle(id: string, title: string, env?: Env): Promise<Thread | null> {
                const db = getDb(env)
                const result = await db
                        .update(threads)
                        .set({
                                title,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(threads.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // スレッドを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(threads).where(eq(threads.id, id)).returning()
                return result.length > 0
        }
}
