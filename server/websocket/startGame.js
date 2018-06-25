const roomUserCache = require('./roomUserCache');
const userCache = require('./userCache');
const webSocketController = require('../controllers/websocket');
const apiController = require('../controllers/api');
const send = require('./send');

broadcast = (wss, data, excludeWs) => {
    wss.clients.forEach((client) => {
        (client !== excludeWs) && client.send(data);
    });
}

gameCountDown = (topicData, roomId) => {
    let gameTime = 20;
    let topicName = topicData.name;
    let topicPrompt = topicData.prompt;
    let roomUserList;
    let drawUserId;
    let gameInfo;
    let gameRound = 1;
    let gameTotalRound = 4; // 默认一共4轮，根据人数改变

    let time = setInterval(async () => {
        if (!gameTime && (gameRound === gameTotalRound)) {
            clearInterval(time);
            return;
        }

        if (!gameTime) {
            // 通知前端弹窗显示答案
            broadcast(wss, JSON.stringify({
                data: { roomId, topicName, showAnswer: true },
                type: 'showAnswer'
            }), userCache.get(drawUserId).ws);

            // 下一个人画, 重新计时重新出题
            let topicData = await webSocketController.getRandomTopic();
            topicData = topicData[0];
            let topicName = topicData.name;
            let topicPrompt = topicData.prompt;
            gameTime = 20;
            drawUserId = roomUserList[gameTotalRound / 2 - 1].userId;
        }

        // 定时查一下数据库，看是否有用户离线了
        if (gameTime % 20) {
            roomUserList = await apiController.getRoomUserListByRoomId({
                roomId: roomId
            })

            gameTotalRound = roomUserList * 2;
            drawUserId = gameRound === 1 && roomUserList[0].userId;
        }

        gameInfo = { roomUserList, gameTime, drawUserId, roomId }
        roomUserCache.set(roomId, Object.assign({}, gameInfo, { topicName, topicPrompt }));
        gameRound++;
        gameTime--;

        // 发送给画的人
        userCache.get(drawUserId).ws.send(JSON.stringify({
            data: Object.assign({}, gameInfo, { topicName }),
            type: 'gameInfo'
        }));

        broadcast(wss, JSON.stringify({
            data: Object.assign({}, gameInfo, { topicPrompt }),
            type: 'gameInfo'
        }), userCache.get(drawUserId).ws);
    }, 1000);
}

startGame = async (wss, roomId) => {
    let topicData = await webSocketController.getRandomTopic();
    topicData = topicData[0];

    gameCountDown(topicData, roomId);
}

module.exports = {
    startGame
}