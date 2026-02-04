"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWSServer = startWSServer;
exports.simulateDrop = simulateDrop;
const ws_1 = require("ws");
let wss = null;
let timer = null;
let messageCounter = 0;
function buildMessage() {
    const chatId = `chat-${Math.floor(Math.random() * 200)}`;
    messageCounter += 1;
    return {
        id: `ws-${Date.now()}-${messageCounter}`,
        chatId,
        ts: Date.now(),
        sender: "remote",
        body: `New message ${messageCounter}`,
    };
}
function scheduleBroadcast() {
    if (!wss)
        return;
    const delay = 1000 + Math.floor(Math.random() * 2000);
    timer = setTimeout(() => {
        if (!wss)
            return;
        const msg = buildMessage();
        const payload = JSON.stringify(msg);
        for (const client of wss.clients) {
            if (client.readyState === 1)
                client.send(payload);
        }
        scheduleBroadcast();
    }, delay);
}
function startWSServer() {
    if (wss)
        return;
    wss = new ws_1.WebSocketServer({ port: 8081 });
    wss.on("connection", ws => {
        ws.on("message", data => {
            if (data.toString() === "ping")
                ws.send("pong");
        });
    });
    scheduleBroadcast();
}
function simulateDrop() {
    if (!wss)
        return;
    for (const client of wss.clients) {
        client.close();
    }
}
