import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ChatList } from "./components/ChatList";
import { Messages } from "./components/Messages";
import { WSClient } from "./services/WebSocketClient";
const ws = new WSClient();
export default function App() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const selectedChatIdRef = useRef(null);
    const api = window.api;
    const loadChats = async () => {
        const next = await api.chats.list(0, 50);
        setChats(next);
    };
    const loadMessages = async (chatId) => {
        const next = await api.messages.list(chatId, undefined, 50);
        setMessages(next);
    };
    useEffect(() => {
        loadChats();
        ws.connect(async (msg) => {
            await api.messages.insert(msg);
            await loadChats();
            if (selectedChatIdRef.current === msg.chatId) {
                await loadMessages(msg.chatId);
            }
        });
    }, []);
    const handleSelectChat = async (chatId) => {
        setSelectedChatId(chatId);
        selectedChatIdRef.current = chatId;
        await api.chats.markRead(chatId);
        await loadMessages(chatId);
        await loadChats();
    };
    return (_jsxs("div", { style: { display: "flex" }, children: [_jsx(ChatList, { chats: chats, onSelect: handleSelectChat }), _jsx(Messages, { messages: messages })] }));
}
