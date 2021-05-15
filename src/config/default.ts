import entities from '@ship-website-demo/common/entity';

export const Config = {
  port: 4000,
  db: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "ship-website-demo",
    entities,
    synchronize: true,
    logging: false
  },
  session: {
    key: 'koa.sess',
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    secure: false,
    sameSite: null,
  },
};