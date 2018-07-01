export default {
    addRoomList(state, data) {
        if (data.length === 0) return;

        if (data instanceof Array) {
            let roomIds = state.roomList.map(x => x.id);
            data = data.filter(x => roomIds.indexOf(x.id) === -1);
            state.roomList.push(...data);
        } else {
            state.roomList.push(data);
        }
    },
    addRoomUser(state, userList) {
        state.roomUserList = userList;
    },
    deleteRoomUser(state) {
        state.roomUserList = [];
    },
    deleteRoomUserByUserId(state, userId) {
        state.roomUserList = state.roomUserList.filter(x => x.userId !== userId);
    },
    drawPicture(state, data) {
        state.drawPictureData = data;
    },
    setGameInfo(state, data) {
        state.gameInfo = data;
    },
    setShowAnswerInfo(state, data) {
        state.showAnswerInfo = Object.assign({}, state.showAnswerInfo, data);
    },
    setGameOverData(state, data) {
        state.gameOverData = Object.assign({}, state.gameOverData, data);
    }
}