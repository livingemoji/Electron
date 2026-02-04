import type { Message } from "../../../shared/types";
export declare const getChats: (offset?: number, limit?: number) => any;
export declare const getMessages: (chatId: string, beforeTs?: number, limit?: number) => any;
export declare const searchMessages: (chatId: string, query: string, limit?: number) => any;
export declare const insertMessage: (msg: Message) => void;
export declare const markRead: (chatId: string) => any;
