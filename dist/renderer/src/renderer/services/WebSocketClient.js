export class WSClient {
    constructor() {
        this.state = "offline";
        this.retries = 0;
    }
    connect(onMessage) {
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
