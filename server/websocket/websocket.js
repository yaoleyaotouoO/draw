const ws = require('ws');
const webSocketSend = require('./send');

const WebSocketServer = ws.Server;

module.exports = (server) => {
    let wss = new WebSocketServer({
        server: server
    });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            webSocketSend(wss, ws, message);
        });

        ws.on('error', (err) => {
            console.log(`errored: ${err}`);
        });
    });
}