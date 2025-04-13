import { Hono } from 'hono';
import { Env } from '../global';
import authRouter from './auth';
import teamsRouter from './teams';
import subscriptionsRouter from './subscriptions';
import projectsRouter from './projects';
import nodesRouter from './projects/nodes';
import edgesRouter from './projects/edges';
import threadsRouter from './projects/threads';

// APIルーターの作成
const apiRouter = new Hono<{ Bindings: Env }>();

// 各APIルーターをマウント
apiRouter.route('/auth', authRouter);
apiRouter.route('/teams', teamsRouter);
apiRouter.route('/subscriptions', subscriptionsRouter);
apiRouter.route('/projects', projectsRouter);
apiRouter.route('/projects', nodesRouter);
apiRouter.route('/projects', edgesRouter);
apiRouter.route('/projects', threadsRouter);

// APIルーターをエクスポート
export default apiRouter;
