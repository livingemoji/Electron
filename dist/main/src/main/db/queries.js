"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.insertMessage = exports.searchMessages = exports.getMessages = exports.getChats = void 0;
const schema_1 = require("./schema");
const getChats = (offset = 0, limit = 50) => schema_1.db.prepare(`
      SELECT * FROM chats
      ORDER BY lastMessageAt DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
exports.getChats = getChats;
const getMessages = (chatId, beforeTs, limit = 50) => {
    if (beforeTs) {
        return schema_1.db.prepare(`
        SELECT * FROM messages
        WHERE chatId = ? AND ts < ?
        ORDER BY ts DESC
        LIMIT ?
      `).all(chatId, beforeTs, limit);
    }
    return schema_1.db.prepare(`
      SELECT * FROM messages
      WHERE chatId = ?
      ORDER BY ts DESC
      LIMIT ?
    `).all(chatId, limit);
};
exports.getMessages = getMessages;
const searchMessages = (chatId, query, limit = 50) => schema_1.db.prepare(`
      SELECT * FROM messages
      WHERE chatId = ? AND body LIKE ?
      ORDER BY ts DESC
      LIMIT ?
    `).all(chatId, `%${query}%`, limit);
exports.searchMessages = searchMessages;
const insertMessage = (msg) => {
    schema_1.db.prepare(`
      INSERT INTO messages VALUES (?, ?, ?, ?, ?)
    `).run(msg.id, msg.chatId, msg.ts, msg.sender, msg.body);
    schema_1.db.prepare(`
      UPDATE chats
      SET lastMessageAt = ?, unreadCount = unreadCount + 1
      WHERE id = ?
    `).run(msg.ts, msg.chatId);
};
exports.insertMessage = insertMessage;
const markRead = (chatId) => schema_1.db.prepare(`
      UPDATE chats SET unreadCount = 0 WHERE id = ?
    `).run(chatId);
exports.markRead = markRead;
