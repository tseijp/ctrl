import { eq, and } from 'drizzle-orm'
import { getDb } from '../db'
import { edges } from '../db/schema'
import { insertEdgeSchema, selectEdgeSchema } from '../db/schema-validation'
import { z } from 'zod'
import { Env } from '../global'

// エッジモデルのインターフェース
export interface Edge {
        id: string
        projectId: string
        sourceNodeId: string
        targetNodeId: string
        type: string
        properties?: any
        createdAt?: string | null
        updatedAt?: string | null
}

// エッジ作成用の入力データ型
export type EdgeCreateInput = z.infer<typeof insertEdgeSchema>

// エッジモデルクラス
export class EdgeModel {
        // エッジをIDで取得
        static async findById(id: string, env?: Env): Promise<Edge | null> {
                const db = getDb(env)
                const result = await db.select().from(edges).where(eq(edges.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // プロジェクトのエッジ一覧を取得
        static async findByProjectId(projectId: string, env?: Env): Promise<Edge[]> {
                const db = getDb(env)
                const result = await db.select().from(edges).where(eq(edges.projectId, projectId))
                return result
        }

        // ソースノードのエッジ一覧を取得
        static async findBySourceNodeId(sourceNodeId: string, env?: Env): Promise<Edge[]> {
                const db = getDb(env)
                const result = await db.select().from(edges).where(eq(edges.sourceNodeId, sourceNodeId))
                return result
        }

        // ターゲットノードのエッジ一覧を取得
        static async findByTargetNodeId(targetNodeId: string, env?: Env): Promise<Edge[]> {
                const db = getDb(env)
                const result = await db.select().from(edges).where(eq(edges.targetNodeId, targetNodeId))
                return result
        }

        // ノードに関連するエッジ一覧を取得（ソースまたはターゲット）
        static async findByNodeId(nodeId: string, env?: Env): Promise<Edge[]> {
                const db = getDb(env)
                const sourceEdges = await db.select().from(edges).where(eq(edges.sourceNodeId, nodeId))

                const targetEdges = await db.select().from(edges).where(eq(edges.targetNodeId, nodeId))

                // 重複を排除して結合
                const allEdges = [...sourceEdges, ...targetEdges]
                const uniqueEdges = allEdges.filter(
                        (edge, index, self) => index === self.findIndex((e) => e.id === edge.id)
                )

                return uniqueEdges
        }

        // 特定のタイプのエッジ一覧を取得
        static async findByType(projectId: string, type: string, env?: Env): Promise<Edge[]> {
                const db = getDb(env)
                const result = await db
                        .select()
                        .from(edges)
                        .where(and(eq(edges.projectId, projectId), eq(edges.type, type)))
                return result
        }

        // 新しいエッジを作成
        static async create(data: EdgeCreateInput, env?: Env): Promise<Edge> {
                const db = getDb(env)
                const result = await db.insert(edges).values(data).returning()

                return result[0]
        }

        // エッジ情報を更新
        static async update(
                id: string,
                data: Partial<Omit<EdgeCreateInput, 'projectId' | 'sourceNodeId' | 'targetNodeId'>>,
                env?: Env
        ): Promise<Edge | null> {
                const db = getDb(env)
                const result = await db
                        .update(edges)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(edges.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // エッジのプロパティを更新
        static async updateProperties(id: string, properties: any, env?: Env): Promise<Edge | null> {
                const db = getDb(env)

                // 現在のエッジ情報を取得
                const edge = await EdgeModel.findById(id, env)
                if (!edge) return null

                // 既存のプロパティとマージ
                const mergedProperties = {
                        ...(edge.properties || {}),
                        ...properties,
                }

                // プロパティを更新
                const result = await db
                        .update(edges)
                        .set({
                                properties: mergedProperties,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(edges.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // エッジのターゲットノードを変更
        static async updateTargetNode(id: string, targetNodeId: string, env?: Env): Promise<Edge | null> {
                const db = getDb(env)
                const result = await db
                        .update(edges)
                        .set({
                                targetNodeId,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(edges.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // エッジのソースノードを変更
        static async updateSourceNode(id: string, sourceNodeId: string, env?: Env): Promise<Edge | null> {
                const db = getDb(env)
                const result = await db
                        .update(edges)
                        .set({
                                sourceNodeId,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(edges.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // エッジを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(edges).where(eq(edges.id, id)).returning()
                return result.length > 0
        }

        // ノードに関連するエッジをすべて削除
        static async deleteByNodeId(nodeId: string, env?: Env): Promise<number> {
                const db = getDb(env)

                // ソースノードまたはターゲットノードとして関連するエッジを削除
                const sourceResult = await db.delete(edges).where(eq(edges.sourceNodeId, nodeId)).returning()

                const targetResult = await db.delete(edges).where(eq(edges.targetNodeId, nodeId)).returning()

                return sourceResult.length + targetResult.length
        }

        // プロジェクトのエッジをすべて削除
        static async deleteByProjectId(projectId: string, env?: Env): Promise<number> {
                const db = getDb(env)
                const result = await db.delete(edges).where(eq(edges.projectId, projectId)).returning()
                return result.length
        }
}
