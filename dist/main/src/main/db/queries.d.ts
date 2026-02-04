import type { Message } from "../../../shared/types";
export declare const getChats: (offset?: number, limit?: number) => unknown[];
export declare const getMessages: (chatId: string, beforeTs?: number, limit?: number) => unknown[];
export declare const searchMessages: (chatId: string, query: string, limit?: number) => unknown[];
export declare const insertMessage: (msg: Message) => void;
export declare const markRead: (chatId: string) => import("better-sqlite3").RunResult;
