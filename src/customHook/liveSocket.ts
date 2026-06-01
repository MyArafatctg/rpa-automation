export class LiveSocket {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageCallback: ((payload: any) => void) | null = null;

  constructor(baseUrl: string, clientId: string) {
    this.url =
      baseUrl.replace("http://", "ws://").replace("https://", "wss://") +
      `/ws/client-ui?client_id=${encodeURIComponent(clientId)}`;
  }

  connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("LiveSocket already open or connecting");
      return;
    }

    this.socket = new WebSocket(this.url);
    console.log("Connecting LiveSocket →", this.url);

    this.socket.onopen = () => {
      console.log("LiveSocket connected");
    };

    this.socket.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(payload);
        }
      } catch (err) {
        console.error("WebSocket message error", err);
      }
    };

    this.socket.onclose = () => {
      console.log("LiveSocket closed → reconnecting in 5 seconds...");
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };
  }

  close() {
    if (this.socket) {
      this.socket.close();
      console.log("LiveSocket closed manually");
    }
  }

  onMessage(callback: (payload: any) => void) {
    this.onMessageCallback = callback;
  }
}
