const webSocketController = require('../controllers/websocket');

// job
let deleteExpireUser = async () => {
    let roomUserList = await webSocketController.getAllRoomUserList();
    console.log("deleteExpireUser roomUserList: ", roomUserList);
    const nowTime = new Date().getTime()
    for (let item of roomUserList) {
        // 5分钟内没有心跳
        if (nowTime - new Date(item.lastActiveTime).getTime() > 1000 * 60 * 5) {
            webSocketController.updateRoomUserActive({ isActive: 0, id: item.id });
        }
    }
}


module.exports = () => {
    setInterval(() => {
        deleteExpireUser();
    }, 1000 * 60 * 5)
}