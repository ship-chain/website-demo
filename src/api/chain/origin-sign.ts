import Router from 'koa-router';
import { router } from './router';
import { getRepository } from "typeorm";
import { expectSession, throwErrorResult } from '../../util';

router.get('/sign-on-chain', (ctx, next) => {
  console.log('sing-on-chain', ctx.params, ctx.query);
  const session = expectSession(ctx);

  ctx.body = {
    signature: 'string',
    publicKey: 'string',
    method: 'string',
    origin: 'string',
    meta: {
      resourceKey: 'string',
    },
  };

  next();
});
