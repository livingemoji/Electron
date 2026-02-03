import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";
import fs from "fs";

const dbPath = path.join(appDataDir(), "chat.db");
export const db = new Database(dbPath);

function appDataDir() {
  const baseDir = app.getPath("userData");
  const dir = path.join(baseDir, "secure-messenger");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function initDB() {
  db.exec(`
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

export function seedDB() {
  const chatCount = db.prepare(`SELECT COUNT(*) as c FROM chats`).get().c;
  if (chatCount > 0) return;

  const insertChat = db.prepare(
    `INSERT INTO chats VALUES (?, ?, ?, ?)`
  );
  const insertMsg = db.prepare(
    `INSERT INTO messages VALUES (?, ?, ?, ?, ?)`
  );

  const now = Date.now();
  const totalMessages = 20000;
  const chatTotal = 200;
  const lastByChat = new Map<string, number>();

  for (let i = 0; i < chatTotal; i++) {
    const chatId = `chat-${i}`;
    const ts = now - i * 60_000;
    lastByChat.set(chatId, ts);
    insertChat.run(chatId, `Chat ${i}`, ts, 0);
  }

  for (let i = 0; i < totalMessages; i++) {
    const chatIndex = i % chatTotal;
    const chatId = `chat-${chatIndex}`;
    const ts = now - i * 1500;
    const prev = lastByChat.get(chatId) ?? ts;
    if (ts > prev) lastByChat.set(chatId, ts);
    insertMsg.run(
      `${chatId}-msg-${i}`,
      chatId,
      ts,
      "system",
      `Seed message ${i}`
    );
  }

  const updateChat = db.prepare(
    `UPDATE chats SET lastMessageAt = ? WHERE id = ?`
  );
  for (const [chatId, ts] of lastByChat.entries()) {
    updateChat.run(ts, chatId);
  }
}
