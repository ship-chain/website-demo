import Router from 'koa-router';
import { router } from './router';
import './origin-sign';

const chainRouter = new Router();

chainRouter.use('/chain', router.routes()).use(router.allowedMethods())

export { chainRouter };