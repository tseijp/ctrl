import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { layers } from '../db/schema'
import { insertLayerSchema, selectLayerSchema } from '../db/schema-validation'
import { z } from 'zod'
import { Env } from '../global'

// レイヤーモデルのインターフェース
export interface Layer {
        id: string
        projectId: string
        name: string
        orderIndex: number
        isVisible: boolean | null
        createdAt?: string | null
        updatedAt?: string | null
}

// レイヤー作成用の入力データ型
export type LayerCreateInput = z.infer<typeof insertLayerSchema>

// レイヤーモデルクラス
export class LayerModel {
        // レイヤーをIDで取得
        static async findById(id: string, env?: Env): Promise<Layer | null> {
                const db = getDb(env)
                const result = await db.select().from(layers).where(eq(layers.id, id)).limit(1)
                return result.length > 0 ? result[0] : null
        }

        // プロジェクトのレイヤー一覧を取得（順序でソート）
        static async findByProjectId(projectId: string, env?: Env): Promise<Layer[]> {
                const db = getDb(env)
                const result = await db.select().from(layers).where(eq(layers.projectId, projectId))

                // 結果をorderIndexでソート
                return result.sort((a, b) => a.orderIndex - b.orderIndex)
        }

        // 新しいレイヤーを作成
        static async create(data: LayerCreateInput, env?: Env): Promise<Layer> {
                const db = getDb(env)

                // 同じプロジェクト内の最大orderIndexを取得
                const maxOrderResult = await db
                        .select({ maxOrder: layers.orderIndex })
                        .from(layers)
                        .where(eq(layers.projectId, data.projectId))
                        .limit(1)

                // 結果をorderIndexの降順でソート
                const sortedResult = maxOrderResult.sort((a, b) => (b.maxOrder || 0) - (a.maxOrder || 0))

                // 新しいレイヤーのorderIndexを設定（既存のレイヤーがない場合は0）
                const orderIndex = maxOrderResult.length > 0 ? (maxOrderResult[0].maxOrder || 0) + 1 : 0

                // レイヤーを作成
                const result = await db
                        .insert(layers)
                        .values({ ...data, orderIndex })
                        .returning()

                return result[0]
        }

        // レイヤー情報を更新
        static async update(
                id: string,
                data: Partial<Omit<LayerCreateInput, 'projectId'>>,
                env?: Env
        ): Promise<Layer | null> {
                const db = getDb(env)
                const result = await db
                        .update(layers)
                        .set({ ...data, updatedAt: new Date().toISOString() })
                        .where(eq(layers.id, id))
                        .returning()
                return result.length > 0 ? result[0] : null
        }

        // レイヤーの表示/非表示を切り替え
        static async toggleVisibility(id: string, env?: Env): Promise<Layer | null> {
                const db = getDb(env)

                // 現在のレイヤー情報を取得
                const layer = await LayerModel.findById(id, env)
                if (!layer) return null

                // 表示/非表示を切り替え
                const result = await db
                        .update(layers)
                        .set({
                                isVisible: !layer.isVisible,
                                updatedAt: new Date().toISOString(),
                        })
                        .where(eq(layers.id, id))
                        .returning()

                return result.length > 0 ? result[0] : null
        }

        // レイヤーの順序を変更
        static async reorder(projectId: string, layerIds: string[], env?: Env): Promise<Layer[]> {
                const db = getDb(env)
                const updatedLayers: Layer[] = []

                // 各レイヤーの順序を更新
                for (let i = 0; i < layerIds.length; i++) {
                        const result = await db
                                .update(layers)
                                .set({
                                        orderIndex: i,
                                        updatedAt: new Date().toISOString(),
                                })
                                .where(eq(layers.id, layerIds[i]))
                                .returning()

                        if (result.length > 0) {
                                updatedLayers.push(result[0])
                        }
                }

                // 更新後のレイヤー一覧を順序でソートして返す
                return updatedLayers.sort((a, b) => a.orderIndex - b.orderIndex)
        }

        // レイヤーを削除
        static async delete(id: string, env?: Env): Promise<boolean> {
                const db = getDb(env)
                const result = await db.delete(layers).where(eq(layers.id, id)).returning()
                return result.length > 0
        }
}
