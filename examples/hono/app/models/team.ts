import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { teams, users } from '../db/schema';
import { insertTeamSchema, selectTeamSchema } from '../db/schema-validation';
import { z } from 'zod';
import { Env } from '../global';
import { User, UserModel } from './user';

// チームモデルのインターフェース
export interface Team {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  subscriptionId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// チーム作成用の入力データ型
export type TeamCreateInput = z.infer<typeof insertTeamSchema>;

// チームモデルクラス
export class TeamModel {
  // チームをIDで取得
  static async findById(id: string, env?: Env): Promise<Team | null> {
    const db = getDb(env);
    const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  // サブスクリプションIDでチームを取得
  static async findBySubscriptionId(subscriptionId: string, env?: Env): Promise<Team | null> {
    const db = getDb(env);
    const result = await db.select().from(teams).where(eq(teams.subscriptionId, subscriptionId)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  // 新しいチームを作成
  static async create(data: TeamCreateInput, env?: Env): Promise<Team> {
    const db = getDb(env);
    const result = await db.insert(teams).values(data).returning();
    return result[0];
  }

  // チーム情報を更新
  static async update(id: string, data: Partial<TeamCreateInput>, env?: Env): Promise<Team | null> {
    const db = getDb(env);
    const result = await db.update(teams)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(teams.id, id))
      .returning();
    return result.length > 0 ? result[0] : null;
  }

  // チームを削除
  static async delete(id: string, env?: Env): Promise<boolean> {
    const db = getDb(env);
    const result = await db.delete(teams).where(eq(teams.id, id)).returning();
    return result.length > 0;
  }

  // チームのメンバー一覧を取得
  static async getMembers(teamId: string, env?: Env): Promise<User[]> {
    return await UserModel.findByTeamId(teamId, env);
  }

  // ユーザーをチームに追加
  static async addMember(teamId: string, userId: string, role: 'admin' | 'member' = 'member', env?: Env): Promise<User | null> {
    const db = getDb(env);
    
    // チームとユーザーが存在するか確認
    const [team, user] = await Promise.all([
      TeamModel.findById(teamId, env),
      UserModel.findById(userId, env)
    ]);
    
    if (!team || !user) {
      return null;
    }
    
    // ユーザーをチームに追加
    const result = await db.update(users)
      .set({ 
        teamId: teamId,
        role: role,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // ユーザーをチームから削除
  static async removeMember(teamId: string, userId: string, env?: Env): Promise<boolean> {
    const db = getDb(env);
    
    // チームとユーザーが存在するか確認
    const [team, user] = await Promise.all([
      TeamModel.findById(teamId, env),
      UserModel.findById(userId, env)
    ]);
    
    if (!team || !user || user.teamId !== teamId) {
      return false;
    }
    
    // ユーザーをチームから削除
    const result = await db.update(users)
      .set({ 
        teamId: null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0;
  }

  // ユーザーのロールを変更
  static async changeRole(teamId: string, userId: string, role: 'admin' | 'member', env?: Env): Promise<User | null> {
    const db = getDb(env);
    
    // チームとユーザーが存在するか確認
    const [team, user] = await Promise.all([
      TeamModel.findById(teamId, env),
      UserModel.findById(userId, env)
    ]);
    
    if (!team || !user || user.teamId !== teamId) {
      return null;
    }
    
    // ユーザーのロールを変更
    const result = await db.update(users)
      .set({ 
        role: role,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }
}
