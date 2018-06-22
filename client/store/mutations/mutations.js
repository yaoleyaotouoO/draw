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
    addRoomUser(state, users) {
        if (users instanceof Array) {
            state.roomUserList.unshift(...users);
            let roomUserList = [];
            state.roomUserList.forEach(x => {
                if (roomUserList.length === 0) {
                    roomUserList.push(x);
                } else {
                    let userIds = roomUserList.map(x => x.userId);
                    if (userIds.indexOf(x.userId) === -1) {
                        roomUserList.push(x);
                    }
                }
            });

            state.roomUserList = roomUserList;
        } else {
            let userIds = state.roomUserList.map(x => x.userId);
            if (userIds.indexOf(users.userId) > -1) return;
            state.roomUserList.push(users);
        }
    },
    deleteRoomUser(state) {
        state.roomUserList = [];
    },
    drawPicture(state, data) {
        state.drawPictureData = data;
    }
}