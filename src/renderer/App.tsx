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
  const api = window.api;

  const loadChats = async () => {
    const next = await api.chats.list(0, 50);
    setChats(next);
  };

  const loadMessages = async (chatId: string) => {
    const next = await api.messages.list(chatId, undefined, 50);
    setMessages(next);
  };

  useEffect(() => {
    loadChats();
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
