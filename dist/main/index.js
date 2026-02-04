"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const schema_1 = require("./db/schema");
const queries_1 = require("./db/queries");
const server_1 = require("./websocket/server");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (electron_1.app.isPackaged) {
        mainWindow.loadFile(path_1.default.join(__dirname, "../renderer/index.html"));
    }
    else {
        mainWindow.loadURL("http://localhost:5173");
    }
}
electron_1.app.whenReady().then(() => {
    (0, schema_1.initDB)();
    (0, schema_1.seedDB)();
    (0, server_1.startWSServer)();
    electron_1.ipcMain.handle("chats:list", (_e, offset, limit) => (0, queries_1.getChats)(offset, limit));
    electron_1.ipcMain.handle("chats:markRead", (_e, chatId) => (0, queries_1.markRead)(chatId));
    electron_1.ipcMain.handle("messages:list", (_e, chatId, beforeTs, limit) => (0, queries_1.getMessages)(chatId, beforeTs, limit));
    electron_1.ipcMain.handle("messages:search", (_e, chatId, query) => (0, queries_1.searchMessages)(chatId, query));
    electron_1.ipcMain.handle("messages:insert", (_e, msg) => (0, queries_1.insertMessage)(msg));
    electron_1.ipcMain.handle("db:seed", () => (0, schema_1.seedDB)());
    electron_1.ipcMain.handle("ws:simulateDrop", () => (0, server_1.simulateDrop)());
    createWindow();
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
