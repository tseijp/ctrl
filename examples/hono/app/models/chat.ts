import { eq, and, desc } from 'drizzle-orm'
import { getDb } from '../db'
import { chats } from '../db/schema'
import { insertChatSchema } from '../db/valid'
import { z } from 'zod'
import { Env } from '../global'

// チャットモデルのインターフェース
export interface Chat {
        id: string
        threadId: string
        userId?: string | null
        role: string
        content: string
        createdAt?: string | null
}

// チャット作成用の入力データ型
export type ChatCreateInput = z.infer<typeof insertChatSchema>

// チャットモデルクラス
export class ChatModel {
        // チャットをIDで取得
        static async findById(id: string, env?: Env): Promise<Chat | null> {
                const db = getDb(env)
                const result = await db.select().from(chats).where(eq(chats.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // スレッドのチャット一覧を取得（作成日時の昇順）
        static async findByThreadId(threadId: string, env?: Env): Promise<Chat[]> {
                const db = getDb(env)
                const result = await db.select().from(chats).where(eq(chats.threadId, threadId))

                // 結果を作成日時の昇順でソート
                return result.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return dateA - dateB // 昇順（古い順）
                })
        }

        // ユーザーのチャット一覧を取得
        static async findByUserId(userId: string, env?: Env): Promise<Chat[]> {
                const db = getDb(env)
                const result = await db.select().from(chats).where(eq(chats.userId, userId))

                // 結果を作成日時の降順でソート
                return result.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return dateB - dateA // 降順（新しい順）
                })
        }

        // スレッドとユーザーのチャット一覧を取得
        static async findByThreadIdAndUserId(threadId: string, userId: string, env?: Env): Promise<Chat[]> {
                const db = getDb(env)
                const result = await db
                        .select()
                        .from(chats)
                        .where(and(eq(chats.threadId, threadId), eq(chats.userId, userId)))

                // 結果を作成日時の昇順でソート
                return result.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return dateA - dateB // 昇順（古い順）
                })
        }

        // スレッドの最新チャットを取得
        static async findLatestByThreadId(threadId: string, limit: number = 1, env?: Env): Promise<Chat[]> {
                const db = getDb(env)
                const result = await db.select().from(chats).where(eq(chats.threadId, threadId))

                // 結果を作成日時の降順でソートして、指定された数だけ返す
                return result
                        .sort((a, b) => {
                                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                                return dateB - dateA // 降順（新しい順）
                        })
                        .slice(0, limit)
        }

        // 新しいチャットを作成
        static async create(data: ChatCreateInput, env?: Env): Promise<Chat> {
                const db = getDb(env)
                const result = await db.insert(chats).values(data).returning()

                return result[0]
        }

        // ユーザーメッセージを作成
        static async createUserMessage(threadId: string, userId: string, content: string, env?: Env): Promise<Chat> {
                return await ChatModel.create(
                        {
                                id: crypto.randomUUID(),
                                threadId,
                                userId,
                                role: 'user',
                                content,
                                createdAt: new Date().toISOString(),
                        },
                        env
                )
        }

        // アシスタントメッセージを作成
        static async createAssistantMessage(threadId: string, content: string, env?: Env): Promise<Chat> {
                return await ChatModel.create(
                        {
                                id: crypto.randomUUID(),
                                threadId,
                                userId: null, // アシスタントの場合はnull
                                role: 'assistant',
                                content,
                                createdAt: new Date().toISOString(),
                        },
                        env
                )
        }

        // チャットを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(chats).where(eq(chats.id, id)).returning()
                return result.length > 0
        }

        // スレッドのチャットをすべて削除
        static async deleteByThreadId(threadId: string, env?: Env): Promise<number> {
                const db = getDb(env)
                const result = await db.delete(chats).where(eq(chats.threadId, threadId)).returning()
                return result.length
        }
}
