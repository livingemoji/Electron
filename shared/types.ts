export type Chat = {
  id: string;
  title: string;
  lastMessageAt: number;
  unreadCount: number;
};

export type Message = {
  id: string;
  chatId: string;
  ts: number;
  sender: string;
  body: string;
};

export type ConnectionState = "connected" | "reconnecting" | "offline";

export type Api = {
  chats: {
    list: (offset?: number, limit?: number) => Promise<Chat[]>;
    markRead: (chatId: string) => Promise<void>;
  };
  messages: {
    list: (chatId: string, beforeTs?: number, limit?: number) => Promise<Message[]>;
    search: (chatId: string, query: string) => Promise<Message[]>;
    insert: (msg: Message) => Promise<void>;
  };
  db: {
    seed: () => Promise<void>;
  };
  ws: {
    simulateDrop: () => Promise<void>;
  };
};
