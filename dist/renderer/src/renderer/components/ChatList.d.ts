interface Chat {
    id: string;
    title: string;
    unreadCount: number;
}
interface ChatListProps {
    chats: Chat[];
    onSelect: (id: string) => void;
}
export declare function ChatList({ chats, onSelect }: ChatListProps): import("react/jsx-runtime").JSX.Element;
export {};
