import Router from 'koa-router';
import { router } from './router';
import { UserCreatDto, UserEntity } from '@ship-website-demo/common';
import { getRepository, MetadataWithSuchNameAlreadyExistsError } from "typeorm";
import { expectSession, throwErrorResult } from '../../util';

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

  ctx.body = user;
  next();
});

userRouter.post('/login', async (ctx, next) => {
  const userRepository = getRepository(UserEntity);
  const dto: UserCreatDto = ctx.request.body || {};
  const user = await userRepository.findOne({ username: dto.name, password: dto.password }, {
    relations: ['books']
  });

  if (!!user) {
    ctx.body = user;
    (ctx as any).session = { uuid: user.uuid };
    return next();
  }
  
  throwErrorResult('authenticated failed', 400);
});

userRouter.get('/login', async (ctx, next) => {
  const session = expectSession(ctx);
  const userRepository = getRepository(UserEntity);
  const user = await userRepository.findOne({ uuid: session.uuid }, {
    relations: ['books']
  });
  
  ctx.body = user;
  next(); 
});

router.use('/user', userRouter.routes())
  .use(userRouter.allowedMethods());
