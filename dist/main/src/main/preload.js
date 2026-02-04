"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    chats: {
        list: (offset, limit) => electron_1.ipcRenderer.invoke("chats:list", offset, limit),
        markRead: chatId => electron_1.ipcRenderer.invoke("chats:markRead", chatId),
    },
    messages: {
        list: (chatId, beforeTs, limit) => electron_1.ipcRenderer.invoke("messages:list", chatId, beforeTs, limit),
        search: (chatId, query) => electron_1.ipcRenderer.invoke("messages:search", chatId, query),
        insert: msg => electron_1.ipcRenderer.invoke("messages:insert", msg),
    },
    db: {
        seed: () => electron_1.ipcRenderer.invoke("db:seed"),
    },
    ws: {
        simulateDrop: () => electron_1.ipcRenderer.invoke("ws:simulateDrop"),
    },
};
electron_1.contextBridge.exposeInMainWorld("api", api);
