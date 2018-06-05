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
    setRoomId(state, roomId) {
        state.roomId = roomId;
    },
    addRoomUser(state, userIds) {
        if (userIds instanceof Array) {
            userIds = userIds.filter(x => state.roomUserList.indexOf(x) === -1);
            state.roomUserList.push(...userIds);
            return;
        }

        if (state.roomUserList.indexOf(userIds) > -1) return;
        state.roomUserList.push(userIds);
    },
    deleteRoomUser(state) {
        state.roomUserList = [];
    }
}