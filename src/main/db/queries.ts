import { db } from "./schema";
import type { Message } from "../../../shared/types";

export const getChats = (offset = 0, limit = 50) =>
  db.prepare(
    `
      SELECT * FROM chats
      ORDER BY lastMessageAt DESC
      LIMIT ? OFFSET ?
    `
  ).all(limit, offset);

export const getMessages = (chatId: string, beforeTs?: number, limit = 50) => {
  if (beforeTs) {
    return db.prepare(
      `
        SELECT * FROM messages
        WHERE chatId = ? AND ts < ?
        ORDER BY ts DESC
        LIMIT ?
      `
    ).all(chatId, beforeTs, limit);
  }

  return db.prepare(
    `
      SELECT * FROM messages
      WHERE chatId = ?
      ORDER BY ts DESC
      LIMIT ?
    `
  ).all(chatId, limit);
};

export const searchMessages = (chatId: string, query: string, limit = 50) =>
  db.prepare(
    `
      SELECT * FROM messages
      WHERE chatId = ? AND body LIKE ?
      ORDER BY ts DESC
      LIMIT ?
    `
  ).all(chatId, `%${query}%`, limit);

export const insertMessage = (msg: Message) => {
  db.prepare(
    `
      INSERT INTO messages VALUES (?, ?, ?, ?, ?)
    `
  ).run(msg.id, msg.chatId, msg.ts, msg.sender, msg.body);

  db.prepare(
    `
      UPDATE chats
      SET lastMessageAt = ?, unreadCount = unreadCount + 1
      WHERE id = ?
    `
  ).run(msg.ts, msg.chatId);
};

export const markRead = (chatId: string) =>
  db.prepare(
    `
      UPDATE chats SET unreadCount = 0 WHERE id = ?
    `
  ).run(chatId);
