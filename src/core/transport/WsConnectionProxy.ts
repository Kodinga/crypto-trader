import { ConnectionProxy } from "./types/ConnectionProxy";

export class WsConnectionProxy implements ConnectionProxy {
  private socket?: WebSocket;
  private onConnectFn?: () => void;
  private onReceivedFn?: (data?: any) => void;
  private onErrorFn?: (error: any) => void;

  constructor(private realm: string) {
    this.socket = undefined;
    this.onReceivedFn = undefined;
  }

  start(): void {
    this.socket = new WebSocket(this.realm);
    this.socket.onopen = () => this.onConnectFn && this.onConnectFn();
    this.socket.onmessage = ({ data }) => {
      this.onReceivedFn && this.onReceivedFn(data);
    };
    this.socket.onerror = (error) => this.onErrorFn && this.onErrorFn(error);
  }

  stop(): void {
    throw new Error("Method not implemented.");
  }

  send(message: any): void {
    if (this.socket) {
      this.socket.send(message);
    }
  }

  onConnect(callback: () => void): void {
    this.onConnectFn = callback;
  }

  onReceived(callback: (data: any) => void): void {
    this.onReceivedFn = callback;
  }

  onError(callback: (error: any) => void): void {
    this.onErrorFn = callback;
  }
}
