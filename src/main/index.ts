import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { initDB, seedDB } from "./db/schema";
import { startWSServer } from "./websocket/server";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  initDB();
  seedDB();
  startWSServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
