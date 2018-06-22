const Koa = require('koa');
const KoaBody = require('koa-body');
const apiRouter = require('./routers/api');
const createWebSocket = require('./websocket/websocket');

const app = new Koa();
app.use(KoaBody());

const HOST = 'localhost';
const PORT = 3333;

let server = app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`);
});

createWebSocket(server);

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());