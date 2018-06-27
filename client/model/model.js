import axios from 'axios';

const request = axios.create({
    baseURL: 'localhost:3333',
    headers: {
        "Authorization": `Bearer 11111`
    }
})

const createError = (code, msg) => {
    const err = new Error(msg);
    err.code = code;
    return err;
}

const handleRequest = (request) => {
    return new Promise((resolve, reject) => {
        request.then(res => {
            const data = res.data;
            if (!data) {
                return reject(createError(400, 'no data'));
            }
            if (!data.success) {
                return reject(createError(400, data));
            }

            resolve(data.data);
        }).catch(err => {
            const res = err.response;
            console.log('handleRequest err: ', res);
            if (res && res.status === 401) {
                reject(createError(401, 'need auth'));
            } else {
                reject(createError(400, 'no data'));
            }
        })
    })
}

export default {
    getUserInfo() {
        return handleRequest(request.get('/api/getUserInfo'));
    },
    login(query) {
        return handleRequest(request.post('/api/login', {
            userName: query.userName,
            passWord: query.passWord
        }));
    },
    getRoomList() {
        return handleRequest(request.get('/api/getRoomList'));
    },
    getRoomUserListByRoomId(roomId) {
        return handleRequest(request.get(`/api/${roomId}/getRoomUserListByRoomId`));
    },
    getRoomIdByUserId(userId) {
        return handleRequest(request.get(`/api/${userId}/getRoomIdByUserId`));
    },
    deleteRoomUserByUserId(userId) {
        return handleRequest(request.delete(`/api/${userId}/deleteRoomUserByUserId`));
    }
}