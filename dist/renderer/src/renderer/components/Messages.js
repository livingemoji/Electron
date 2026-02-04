import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function Messages({ messages }) {
    return (_jsx("div", { children: messages.map((m) => (_jsxs("div", { children: [_jsxs("b", { children: [m.sender, ":"] }), " ", m.body] }, m.id))) }));
}
