import Koa from "koa";
import bodyparser from "koa-bodyparser";
import staticFiles from "koa-static";
import * as path from "path";
import * as os from "os";
import { Config } from "./config/default";
import { apiRouter } from './api/api';
import { chainRouter } from './api/chain';
import { createConnection } from 'typeorm';
import { listen } from './chain/listen';

const session = require('koa-session');

const app = new Koa();

app.keys = ['ship ship xxxxx'];
app.use(session(Config.session, app));

app.use(staticFiles(path.resolve(__dirname, "../public")))

app.use(bodyparser());

app.use(async (ctx, next) => {
    /** 请求路径 */
    // const path = ctx.request.path;

    console.log("--------------------------");
    console.count("request count");
    console.log(ctx.request.method.toUpperCase(), ': ', ctx.request.path);
    console.log('session', ctx.session);
    
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Content-Type', 'application/json')
    ctx.set('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin')
    ctx.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    ctx.set(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, PATCH, OPTIONS'
    )
    ctx.set('Access-Control-Allow-Credentials', 'true');
    // ctx.set({
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Credentials": "true",
    //     "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
    //     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    //     // "X-Powered-By": "3.2.1",
    //     // "Content-Security-Policy": `script-src "self"` // 只允许页面`script`引入自身域名的地址
    // });

    // const hasPath = router.stack.some(item => item.path == path);
    // // 判断是否 404
    // if (path != "/" && !hasPath) {
    //     return ctx.body = "<h1 style="text-align: center; line-height: 40px; font-size: 24px; color: tomato">404：访问的页面（路径）不存在</h1>";
    // }

    // 如果前端设置了 XHR.setRequestHeader("Content-Type", "application/json")
    // ctx.set 就必须携带 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization" 
    // 如果前端设置了 XHR.setRequestHeader("Authorization", "xxxx") 那对应的字段就是 Authorization
    // 并且这里要转换一下状态码
    // console.log(ctx.request.method);
    if (ctx.request.method === "OPTIONS") {
        ctx.response.status = 200;
    }

    try {
      await next();
      ctx.body = {
        data: ctx.body,
        message: 'success',
        code: 0,
      }
      // console.log('body', ctx.body);
    } catch (err) {
        console.log('err', err);
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.body = {
          data: ctx.body,
          message: err.message || err,
          code: 1,
        }
    }
});

app.use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

app.use(chainRouter.routes())
  .use(chainRouter.allowedMethods());

app.on("error", (err, ctx) => {
  console.log(`\x1B[91m server error !!!!!!!!!!!!! \x1B[0m`, err, ctx);
})

function getIPAdress() {
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
        const iface = interfaces[key];
        if (!iface) {
          continue;
        }
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                return alias.address;
            }
        }
    }
}

listen();

createConnection(Config.db as any).then(
  () =>
    app.listen(Config.port, () => {
        console.log("服务器启动完成:");
        console.log(` - Local:   \x1B[36m http://localhost:\x1B[0m\x1B[96m${ Config.port } \x1B[0m`);
        console.log(` - Network: \x1B[36m http://${getIPAdress()}:\x1B[0m\x1B[96m${ Config.port } \x1B[0m`);
    }),
  e => console.log('connect db error',  e)
)
