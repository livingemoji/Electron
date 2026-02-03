export function Messages({ messages }: any) {
  return (
    <div>
      {messages.map((m: any) => (
        <div key={m.id}>
          <b>{m.sender}:</b> {m.body}
        </div>
      ))}
    </div>
  );
}
