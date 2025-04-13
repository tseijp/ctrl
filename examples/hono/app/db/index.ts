import { drizzle } from 'drizzle-orm/d1';
import { Env } from '../global';

// D1データベース接続を初期化する関数
export function initDb(env: Env) {
  return drizzle(env.DB);
}

// グローバルなデータベース接続（開発環境用）
// 本番環境では各リクエストごとにinitDb(env)を呼び出す
let _db: ReturnType<typeof initDb> | null = null;

// データベース接続を取得する関数
export function getDb(env?: Env) {
  if (env) {
    return initDb(env);
  }
  
  if (!_db) {
    throw new Error('Database not initialized. Please provide env in production.');
  }
  
  return _db;
}

// テスト用にデータベース接続をセットする関数
export function setDb(db: ReturnType<typeof initDb>) {
  _db = db;
}
