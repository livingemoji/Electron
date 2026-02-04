import { contextBridge, ipcRenderer } from "electron";
import type { Api } from "../../shared/types";

const api: Api = {
  chats: {
    list: (offset, limit) => ipcRenderer.invoke("chats:list", offset, limit),
    markRead: chatId => ipcRenderer.invoke("chats:markRead", chatId),
  },
  messages: {
    list: (chatId, beforeTs, limit) =>
      ipcRenderer.invoke("messages:list", chatId, beforeTs, limit),
    search: (chatId, query) =>
      ipcRenderer.invoke("messages:search", chatId, query),
    insert: msg => ipcRenderer.invoke("messages:insert", msg),
  },
  db: {
    seed: () => ipcRenderer.invoke("db:seed"),
  },
  ws: {
    simulateDrop: () => ipcRenderer.invoke("ws:simulateDrop"),
  },
};

contextBridge.exposeInMainWorld("api", api);
