import moment from 'moment';

export default (router, store) => {
    //  const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
    const webSocket = new WebSocket('ws://localhost:3333/ws/');

    let reconnect = () => {
        webSocket = new WebSocket('ws://localhost:3333/ws/');
    }

    webSocket.onopen = () => {
        webSocket.send(JSON.stringify({
            data: {
                userId: Number(localStorage.getItem('userId'))
            },
            type: 'setWebSocketUserId'
        }))
    }

    webSocket.onmessage = (event) => {
        //        console.log("webSocket onmessage: ", event.data);
        let messageData = JSON.parse(event.data);
        let roomId = localStorage.getItem('roomId') && localStorage.getItem('roomId').toString();
        let userId = localStorage.getItem('userId') && Number(localStorage.getItem('userId'));
        let dataRoomId = messageData.data.roomId.toString();
        switch (messageData.type) {
            case 'addRoom':
                store.commit('addRoomList', messageData.data);
                break;
            case 'addRoomUser':
                if (dataRoomId === roomId) {
                    store.commit('addRoomUser', {
                        userId: messageData.data.userId,
                        userName: messageData.data.userName
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
                    console.log('data: ', messageData.data);
                    store.commit('drawPicture', messageData.data);
                }
                break;
            case 'gameInfo':
                if (dataRoomId === roomId) {
                    store.commit('setGameInfo', messageData.data);
                }
                break;
            case 'showAnswer':
                if (dataRoomId === roomId) {
                    store.commit('setShowAnswerInfo', messageData.data);
                }
                break;
            case 'gameOver':
                if (dataRoomId === roomId) {
                    store.commit('', messageData.data);
                }
            default:
                console.warn('webSocket onmessage not type!');
        }
    }

    webSocket.onclose = (event) => {
        console.log("event: ", event);
    }

    return webSocket;
}