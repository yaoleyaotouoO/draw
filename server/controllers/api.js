const { sqlQuery } = require('../db/db');

async function getUserInfo() {
    let sql = 'SELECT * FROM draw_UserInfo';

    return await sqlQuery(sql);
}

async function login(query) {
    let sql = `SELECT * FROM draw_UserInfo WHERE userName = ? AND passWord = ?`
    let values = [query.userName, query.passWord];

    return await sqlQuery(sql, values);
}

async function getRoomList() {
    let sql = 'SELECT * FROM draw_Room WHERE status = 1';

    return await sqlQuery(sql);
}

async function getRoomUserList(query) {
    let sql = `
    SELECT 
        ru.userId, ui.name userName
    FROM 
        draw_RoomUser ru
    LEFT JOIN 
        draw_userinfo ui ON ui.id = ru.userId
    WHERE 
        roomId = ?`;
    let values = [query.roomId];

    return await sqlQuery(sql, values);
}

module.exports = {
    getUserInfo,
    login,
    getRoomList,
    getRoomUserList
}