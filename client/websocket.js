export default (router, store) => {
    //  const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
    let webSocket = new WebSocket('ws://0.0.0.0/ws/');

    let reconnect = () => {
        //   webSocket = new WebSocket('ws://localhost:3333/ws/');
    }

    webSocket.onopen = () => {
        webSocket.send(JSON.stringify({
            data: {
                userId: Number(localStorage.getItem('userId')),
                userName: localStorage.getItem('userName'),
                roomId: localStorage.getItem('roomId')
            },
            type: 'setWebSocketUserId'
        }))
    }

    webSocket.onmessage = (event) => {
        let messageData = JSON.parse(event.data);
        let roomId = localStorage.getItem('roomId') && localStorage.getItem('roomId').toString();
        let userId = localStorage.getItem('userId') && Number(localStorage.getItem('userId'));
        let dataRoomId = messageData.data.roomId && messageData.data.roomId.toString();
        if (dataRoomId !== roomId) {
            return;
        }

        switch (messageData.type) {
            case 'addRoom':
                store.commit('addRoomList', messageData.data);
                break;
            case 'changedRoomUser':
                store.commit('changedRoomUser', messageData.data.userList);
                break;
            case 'startGame':
                router.push({ name: 'game', params: { roomId } });
                break;
            case 'drawPicture':
                store.commit('drawPicture', messageData.data);
                break;
            case 'gameInfo':
                store.commit('setGameInfo', messageData.data);
                break;
            case 'showAnswer':
                store.commit('setShowAnswerInfo', messageData.data);
                break;
            case 'gameOver':
                store.commit('setGameOverData', messageData.data.gameOverScoreList);
                break;
            case 'deleteRoomUser':
                store.commit('deleteRoomUserByUserId', messageData.data.userId);
                break;
            case 'showChatMessage':
                store.commit('setChatMessage', messageData.data);
                break;
            case 'showRoomUserScore':
                store.commit('setRoomUserScoreList', messageData.data.roomUserScoreList);
            default:
                console.warn('webSocket onmessage not type!: ', messageData);
        }
    }

    webSocket.onclose = (event) => {
        console.log("event: ", event);
    }

    return webSocket;
}