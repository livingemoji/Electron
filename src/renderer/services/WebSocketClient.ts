type State = "connected" | "reconnecting" | "offline";

export class WSClient {
  ws?: WebSocket;
  state: State = "offline";
  retries = 0;

  connect(onMessage: (data: any) => void) {
    this.ws = new WebSocket("ws://localhost:8081");

    this.ws.onopen = () => {
      this.state = "connected";
      this.retries = 0;
    };

    this.ws.onmessage = e => {
      onMessage(JSON.parse(e.data));
    };

    this.ws.onclose = () => {
      this.state = "reconnecting";
      setTimeout(() => this.connect(onMessage), 2 ** this.retries * 1000);
      this.retries++;
    };
  }
}
