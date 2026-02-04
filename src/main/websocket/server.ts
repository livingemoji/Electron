import { WebSocketServer } from "ws";
import type { RawData, WebSocket } from "ws";
import type { Message } from "../../../shared/types";

let wss: WebSocketServer | null = null;
let timer: NodeJS.Timeout | null = null;
let messageCounter = 0;

function buildMessage(): Message {
  const chatId = `chat-${Math.floor(Math.random() * 200)}`;
  messageCounter += 1;
  return {
    id: `ws-${Date.now()}-${messageCounter}`,
    chatId,
    ts: Date.now(),
    sender: "remote",
    body: `New message ${messageCounter}`,
  };
}

function scheduleBroadcast() {
  if (!wss) return;
  const delay = 1000 + Math.floor(Math.random() * 2000);
  timer = setTimeout(() => {
    if (!wss) return;
    const msg = buildMessage();
    const payload = JSON.stringify(msg);
    for (const client of wss.clients) {
      if (client.readyState === 1) client.send(payload);
    }
    scheduleBroadcast();
  }, delay);
}

export function startWSServer() {
  if (wss) return;
  wss = new WebSocketServer({ port: 8081 });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data: RawData) => {
      if (data.toString() === "ping") ws.send("pong");
    });
  });

  scheduleBroadcast();
}

export function simulateDrop() {
  if (!wss) return;
  for (const client of wss.clients) {
    client.close();
  }
}
