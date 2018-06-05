const Router = require('koa-router');
const apiController = require('../controllers/api');

const apiRouter = new Router({ prefix: '/api' });


const successResponse = (data) => {
    return {
        success: true,
        data
    }
}

apiRouter
    .get('/getUserInfo', async (ctx) => {
        const data = await apiController.getUserInfo();
        ctx.body = successResponse(data);
    })
    .post('/login', async (ctx) => {
        const data = await apiController.login(ctx.request.body);
        ctx.body = successResponse(data);
    })
    .get('/getRoomList', async (ctx) => {
        const data = await apiController.getRoomList();
        ctx.body = successResponse(data);
    })
    .get('/:roomId/getRoomUserList', async(ctx) =>{
        const data =await apiController.getRoomUserList(ctx.params);
        ctx.body = successResponse(data);
    })

module.exports = apiRouter;