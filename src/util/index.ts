import type { ParameterizedContext } from 'koa';
import type Router from 'koa-router';

export const throwErrorResult = (message: string, statusCode = 400) => {
  const err = new Error(message);
  (err as any).statusCode = statusCode;
  throw err;
}

export const expectSession = (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>): { uuid: string } => {
  const session: { uuid: string } = (ctx as any).session;

  if (!session.uuid) {
    throwErrorResult('authenticated failed', 400);
  }

  return session;
}