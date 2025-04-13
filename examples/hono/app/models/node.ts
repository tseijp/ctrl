import { eq, and } from 'drizzle-orm';
import { getDb } from '../db';
import { nodes } from '../db/schema';
import { insertNodeSchema, selectNodeSchema } from '../db/schema-validation';
import { z } from 'zod';
import { Env } from '../global';

// ノードモデルのインターフェース
export interface Node {
  id: string;
  projectId: string;
  layerId: string;
  type: string;
  name: string;
  properties?: any;
  positionX?: string | null;
  positionY?: string | null;
  width?: string | null;
  height?: string | null;
  tailwindClasses?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
}

// ノード作成用の入力データ型
export type NodeCreateInput = z.infer<typeof insertNodeSchema>;

// ノードモデルクラス
export class NodeModel {
  // ノードをIDで取得
  static async findById(id: string, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    const result = await db.select().from(nodes).where(eq(nodes.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  // プロジェクトのノード一覧を取得
  static async findByProjectId(projectId: string, env?: Env): Promise<Node[]> {
    const db = getDb(env);
    const result = await db.select()
      .from(nodes)
      .where(eq(nodes.projectId, projectId));
    return result;
  }

  // レイヤーのノード一覧を取得
  static async findByLayerId(layerId: string, env?: Env): Promise<Node[]> {
    const db = getDb(env);
    const result = await db.select()
      .from(nodes)
      .where(eq(nodes.layerId, layerId));
    return result;
  }

  // プロジェクトとレイヤーのノード一覧を取得
  static async findByProjectIdAndLayerId(projectId: string, layerId: string, env?: Env): Promise<Node[]> {
    const db = getDb(env);
    const result = await db.select()
      .from(nodes)
      .where(
        and(
          eq(nodes.projectId, projectId),
          eq(nodes.layerId, layerId)
        )
      );
    return result;
  }

  // 特定のタイプのノード一覧を取得
  static async findByType(projectId: string, type: string, env?: Env): Promise<Node[]> {
    const db = getDb(env);
    const result = await db.select()
      .from(nodes)
      .where(
        and(
          eq(nodes.projectId, projectId),
          eq(nodes.type, type)
        )
      );
    return result;
  }

  // 新しいノードを作成
  static async create(data: NodeCreateInput, env?: Env): Promise<Node> {
    const db = getDb(env);
    const result = await db.insert(nodes)
      .values(data)
      .returning();
    
    return result[0];
  }

  // ノード情報を更新
  static async update(id: string, data: Partial<Omit<NodeCreateInput, 'projectId' | 'layerId'>>, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    const result = await db.update(nodes)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(nodes.id, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  }

  // ノードの位置を更新
  static async updatePosition(id: string, positionX: string, positionY: string, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    const result = await db.update(nodes)
      .set({ 
        positionX,
        positionY,
        updatedAt: new Date().toISOString()
      })
      .where(eq(nodes.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // ノードのサイズを更新
  static async updateSize(id: string, width: string, height: string, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    const result = await db.update(nodes)
      .set({ 
        width,
        height,
        updatedAt: new Date().toISOString()
      })
      .where(eq(nodes.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // ノードのTailwindクラスを更新
  static async updateTailwindClasses(id: string, tailwindClasses: string, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    const result = await db.update(nodes)
      .set({ 
        tailwindClasses,
        updatedAt: new Date().toISOString()
      })
      .where(eq(nodes.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // ノードのプロパティを更新
  static async updateProperties(id: string, properties: any, env?: Env): Promise<Node | null> {
    const db = getDb(env);
    
    // 現在のノード情報を取得
    const node = await NodeModel.findById(id, env);
    if (!node) return null;
    
    // 既存のプロパティとマージ
    const mergedProperties = {
      ...(node.properties || {}),
      ...properties
    };
    
    // プロパティを更新
    const result = await db.update(nodes)
      .set({ 
        properties: mergedProperties,
        updatedAt: new Date().toISOString()
      })
      .where(eq(nodes.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // ノードを削除
  static async delete(id: string, env?: Env): Promise<boolean> {
    const db = getDb(env);
    const result = await db.delete(nodes).where(eq(nodes.id, id)).returning();
    return result.length > 0;
  }

  // レイヤーのノードをすべて削除
  static async deleteByLayerId(layerId: string, env?: Env): Promise<number> {
    const db = getDb(env);
    const result = await db.delete(nodes).where(eq(nodes.layerId, layerId)).returning();
    return result.length;
  }

  // プロジェクトのノードをすべて削除
  static async deleteByProjectId(projectId: string, env?: Env): Promise<number> {
    const db = getDb(env);
    const result = await db.delete(nodes).where(eq(nodes.projectId, projectId)).returning();
    return result.length;
  }
}
