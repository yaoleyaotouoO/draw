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
    addRoomUser(state, users) {
        if (users instanceof Array) {
            let userIds = state.roomUserList.map(x => x.userId);
            users = users.filter(x => userIds.indexOf(x.userId) === -1);
            state.roomUserList.push(...users);
            return;
        }

        if (state.roomUserList.indexOf(users) > -1) return;
        state.roomUserList.push(users);
    },
    deleteRoomUser(state) {
        state.roomUserList = [];
    }
}