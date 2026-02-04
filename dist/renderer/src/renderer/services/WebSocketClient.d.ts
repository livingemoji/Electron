type State = "connected" | "reconnecting" | "offline";
export declare class WSClient {
    ws?: WebSocket;
    state: State;
    retries: number;
    connect(onMessage: (data: any) => void): void;
}
export {};
