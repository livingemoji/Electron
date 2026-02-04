import { useEffect, useRef, useState } from "react";
import { ChatList } from "./components/ChatList";
import { Messages } from "./components/Messages";
import { WSClient } from "./services/WebSocketClient";
import type { Chat, Message } from "../../shared/types";

const ws = new WSClient();

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChatIdRef = useRef<string | null>(null);
  const api = typeof window !== "undefined" ? window.api : undefined;

  const mockChats: Chat[] = Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i}`,
    title: `Mock Chat ${i + 1}`,
    lastMessageAt: Date.now() - i * 60_000,
    unreadCount: i % 3 === 0 ? 2 : 0,
  }));
  const mockMessages = (chatId: string): Message[] =>
    Array.from({ length: 25 }, (_, i) => ({
      id: `${chatId}-msg-${i}`,
      chatId,
      ts: Date.now() - i * 45_000,
      sender: i % 2 === 0 ? "you" : "them",
      body: `Mock message ${i + 1}`,
    }));

  const loadChats = async () => {
    if (!api) {
      setChats(mockChats);
      return;
    }
    const next = await api.chats.list(0, 50);
    setChats(next);
  };

  const loadMessages = async (chatId: string) => {
    if (!api) {
      setMessages(mockMessages(chatId));
      return;
    }
    const next = await api.messages.list(chatId, undefined, 50);
    setMessages(next);
  };

  useEffect(() => {
    loadChats();
    if (!api) return;
    ws.connect(async (msg: Message) => {
      await api.messages.insert(msg);
      await loadChats();
      if (selectedChatIdRef.current === msg.chatId) {
        await loadMessages(msg.chatId);
      }
    });
  }, []);

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    selectedChatIdRef.current = chatId;
    if (!api) {
      await loadMessages(chatId);
      return;
    }
    await api.chats.markRead(chatId);
    await loadMessages(chatId);
    await loadChats();
  };

  return (
    <div style={{ display: "flex" }}>
      <ChatList chats={chats} onSelect={handleSelectChat} />
      <Messages messages={messages} />
    </div>
  );
}
