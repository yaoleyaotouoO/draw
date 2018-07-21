import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const request = axios.create({
    // 192.168.0.105
    baseURL: isDev ? 'http://localhost:3333' : 'http://draw.yaoleyaotou.xin:3333',
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
    login({ userName, passWord }) {
        return handleRequest(request.post('/api/login', {
            userName: userName,
            passWord: passWord
        }));
    },
    register({ userName, passWord }) {
        return handleRequest(request.post('/api/register', {
            userName: userName,
            passWord: passWord
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