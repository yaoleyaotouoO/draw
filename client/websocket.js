import moment from 'moment';

export default (router, store) => {
    //  const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
    const webSocket = new WebSocket('ws://localhost:3333/ws/');

    let reconnect = () => {
        webSocket = new WebSocket('ws://localhost:3333/ws/');
    }

    webSocket.onopen = () => {
        
    }

    webSocket.onmessage = (event) => {
        console.log("webSocket onmessage: ", event.data);
        let data = JSON.parse(event.data);
        let roomId = localStorage.getItem('roomId') && localStorage.getItem('roomId').toString();
        let dataRoomId = data.data.roomId.toString();
        switch (data.type) {
            case 'addRoom':
                store.commit('addRoomList', data.data);
                break;
            case 'addRoomUser':
                if (dataRoomId === roomId) {
                    store.commit('addRoomUser', {
                        userId: data.data.userId,
                        userName: data.data.userName
                    });
                }
                break;
            case 'startGame':
                if (dataRoomId === roomId) {
                    router.push({ name: 'game', params: { roomId } })
                }
                break;
            case 'drawPicture':
                if (dataRoomId === roomId) {
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