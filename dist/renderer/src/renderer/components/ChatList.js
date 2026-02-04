import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FixedSizeList as List } from "react-window";
export function ChatList({ chats, onSelect }) {
    return (_jsx(List, { height: 700, width: 300, itemSize: 60, itemCount: chats.length, children: ({ index, style }) => {
            const c = chats[index];
            return (_jsxs("div", { style: style, onClick: () => onSelect(c.id), role: "button", children: [_jsx("b", { children: c.title }), c.unreadCount > 0 && _jsxs("span", { children: [" (", c.unreadCount, ")"] })] }, c.id));
        } }));
}
