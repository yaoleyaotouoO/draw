export default (router, store) => {
    //  const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
    const webSocket = new WebSocket('ws://localhost:3333/ws/');
    webSocket.onmessage = (event) => {
        console.log("webSocket onmessage: ", event.data);
        var data = JSON.parse(event.data);
        switch (data.type) {
            case 'addRoom':
                store.commit('addRoomList', data.data);
                break;
            case 'addRoomUser':
                if (data.data.roomId === store.state.roomId) {
                    store.commit('addRoomUser', {
                        userId: data.data.userId,
                        userName: data.data.userName
                    });
                }
                break;
            case 'startGame':
                if (data.data.roomId === store.state.roomId) {
                    //next({ path: '/game', query: { roomId: data.data.roomId } })
                    router.push({ name: 'game', params: { roomId: data.data.roomId } })
                }
                break;
            case 'drawPicture':
                if (data.data.roomId === store.state.roomId) {
                    console.log('data: ', data.data);
                    store.commit('drawPicture', data.data);
                }

                break;
            default:
                console.log("datatype: ", data.type);
                console.warn('webSocket onmessage not type!');
        }
    }

    return webSocket;
}