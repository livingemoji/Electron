import { FixedSizeList as List } from "react-window";

interface Chat {
  id: string | number;
  title: string;
  unreadCount: number;
}

interface ChatListProps {
  chats: Chat[];
  onSelect: (id: string | number) => void;
}

export function ChatList({ chats, onSelect }: ChatListProps) {
  return (
    <List height={700} width={300} itemSize={60} itemCount={chats.length}>
      {({ index, style }) => {
        const c = chats[index];
        return (
          <div style={style} onClick={() => onSelect(c.id)} key={c.id} role="button">
            <b>{c.title}</b>
            {c.unreadCount > 0 && <span> ({c.unreadCount})</span>}
          </div>
        );
      }}
    </List>
  );
}
