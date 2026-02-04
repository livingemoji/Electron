"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
exports.seedDB = seedDB;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = path_1.default.join(appDataDir(), "chat.db");
exports.db = new better_sqlite3_1.default(dbPath);
function appDataDir() {
    const baseDir = electron_1.app.getPath("userData");
    const dir = path_1.default.join(baseDir, "secure-messenger");
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
    return dir;
}
function initDB() {
    exports.db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      title TEXT,
      lastMessageAt INTEGER,
      unreadCount INTEGER
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT,
      ts INTEGER,
      sender TEXT,
      body TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_messages_chat_ts ON messages(chatId, ts);
    CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt ON chats(lastMessageAt);
  `);
}
function seedDB() {
    const row = exports.db.prepare(`SELECT COUNT(*) as c FROM chats`).get();
    const chatCount = row.c;
    if (chatCount > 0)
        return;
    const insertChat = exports.db.prepare(`INSERT INTO chats VALUES (?, ?, ?, ?)`);
    const insertMsg = exports.db.prepare(`INSERT INTO messages VALUES (?, ?, ?, ?, ?)`);
    const now = Date.now();
    const totalMessages = 20000;
    const chatTotal = 200;
    const lastByChat = new Map();
    for (let i = 0; i < chatTotal; i++) {
        const chatId = `chat-${i}`;
        const ts = now - i * 60000;
        lastByChat.set(chatId, ts);
        insertChat.run(chatId, `Chat ${i}`, ts, 0);
    }
    for (let i = 0; i < totalMessages; i++) {
        const chatIndex = i % chatTotal;
        const chatId = `chat-${chatIndex}`;
        const ts = now - i * 1500;
        const prev = lastByChat.get(chatId) ?? ts;
        if (ts > prev)
            lastByChat.set(chatId, ts);
        insertMsg.run(`${chatId}-msg-${i}`, chatId, ts, "system", `Seed message ${i}`);
    }
    const updateChat = exports.db.prepare(`UPDATE chats SET lastMessageAt = ? WHERE id = ?`);
    for (const [chatId, ts] of lastByChat.entries()) {
        updateChat.run(ts, chatId);
    }
}
