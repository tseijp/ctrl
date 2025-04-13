import { authHandler, verifyAuth } from '@hono/auth-js';
import { MiddlewareHandler } from 'hono';

// 認証ハンドラーミドルウェア
export const authMiddleware = authHandler();

// 認証検証ミドルウェア
export const requireAuth: MiddlewareHandler = verifyAuth();

// サインイン・サインアウト用のミドルウェア
export { signIn, signOut } from '@hono/auth-js/react';
