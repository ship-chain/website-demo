import Router from 'koa-router';
import { router } from './router';
import { UserCreatDto, UserEntity } from '@ship-website-demo/common';
import { getRepository } from "typeorm";
import { throwErrorResult } from '../util';

const userRouter = new Router();

userRouter.post('/register', async (ctx, next) => {
  const userRepository = getRepository(UserEntity);
  const dto: UserCreatDto = ctx.request.body || {};

  const user = userRepository.create({
    password: dto.password,
    username: dto.name,
    balance: 1000,
  })
  await userRepository.save(user);
  // console.log('dto', dto);
  // console.log('user', user);
  ctx.body = user;
  next();
});

userRouter.post('/login', async (ctx, next) => {
  const userRepository = getRepository(UserEntity);
  const dto: UserCreatDto = ctx.request.body || {};
  const [ user ] = await userRepository.find({ username: dto.name, password: dto.password });

  if (!!user) {
    ctx.body = user;
    (ctx as any).session = { uuid: user.uuid };
    return next();
  }
  
  throwErrorResult('authenticated failed', 400);
});

userRouter.get('/login', async (ctx: any) => {
  const session = (ctx as any).session as ({ uuid: string } | undefined);
    
  if (!session || !session.uuid) {
    throwErrorResult('authenticated failed', 400);
  }
  
  const userRepository = getRepository(UserEntity);
  const [ user ] = await userRepository.find({ uuid: session?.uuid });
  
  ctx.body = user;
});

router.use('/user', userRouter.routes())
  .use(userRouter.allowedMethods());
