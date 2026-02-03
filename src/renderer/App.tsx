import { useEffect, useState } from "react";
import { ChatList } from "./components/ChatList";
import { Messages } from "./components/Messages";
import { WSClient } from "./services/WebSocketClient";

const ws = new WSClient();

export default function App() {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    ws.connect(msg => {
      // trigger reload from DB via IPC
    });
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <ChatList chats={chats} onSelect={() => {}} />
      <Messages messages={messages} />
    </div>
  );
}
