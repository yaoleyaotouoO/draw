const { sqlQuery } = require('../db/db');

async function createRoom(query) {
    let sql = 'INSERT INTO draw_Room(id, name, createTime, status) VALUES (0, ?, ?, ?)';
    let values = [query.name, query.createRoom, query.status];

    return await sqlQuery(sql, values);
}

async function addRoomUser(query) {
    let sql = 'SELECT * FROM draw_RoomUser WHERE userId = ? AND roomId = ?';
    let values = [query.userId, query.roomId];
    let data = await sqlQuery(sql, values);
    if (data.length > 0) return;
    
    sql = 'INSERT INTO draw_RoomUser(id, userId, roomId) VALUES (0, ?, ?)';

    return await sqlQuery(sql, values);
}

module.exports = {
    createRoom: createRoom,
    addRoomUser: addRoomUser
}