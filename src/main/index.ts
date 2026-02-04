import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { initDB, seedDB } from "./db/schema";
import {
  getChats,
  getMessages,
  insertMessage,
  markRead,
  searchMessages,
} from "./db/queries";
import { simulateDrop } from "./websocket/server";
import { startWSServer } from "./websocket/server";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  initDB();
  seedDB();
  startWSServer();
  ipcMain.handle("chats:list", (_e, offset?: number, limit?: number) =>
    getChats(offset, limit)
  );
  ipcMain.handle("chats:markRead", (_e, chatId: string) => markRead(chatId));
  ipcMain.handle(
    "messages:list",
    (_e, chatId: string, beforeTs?: number, limit?: number) =>
      getMessages(chatId, beforeTs, limit)
  );
  ipcMain.handle("messages:search", (_e, chatId: string, query: string) =>
    searchMessages(chatId, query)
  );
  ipcMain.handle("messages:insert", (_e, msg) => insertMessage(msg));
  ipcMain.handle("db:seed", () => seedDB());
  ipcMain.handle("ws:simulateDrop", () => simulateDrop());
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
