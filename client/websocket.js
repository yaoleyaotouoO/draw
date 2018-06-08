import moment from 'moment';

export default (router, store) => {
    //  const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
    const webSocket = new WebSocket('ws://localhost:3333/ws/');

    const timeOut = 1000 * 60;

    let keepAliveTimer = null;

    webSocket.onopen = () => {
        keepAliveTimer = setTimeout(() => {
            webSocket.send(JSON.stringify({
                data: {
                    lastActiveTime: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
                    userId: Number(localStorage.getItem('userId')),
                    isActive: 1
                },
                type: 'keepAlive'
            }))
        }, timeOut)
    }

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
                console.warn('webSocket onmessage not type!');
        }
    }

    webSocket.onclose = (event) => {
        console.log("event: ", event);
    }

    return webSocket;
}