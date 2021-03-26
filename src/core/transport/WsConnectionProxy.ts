import { ConnectionProxy } from "./types/ConnectionProxy";

export class WsConnectionProxy implements ConnectionProxy {
  private socket?: WebSocket;
  private onConnectFn?: () => void;
  private onReceivedFn?: (data?: any) => void;
  private onErrorFn?: (error: any) => void;
  private onCloseFn?: () => void;

  constructor() {
    this.socket = undefined;
    this.onReceivedFn = undefined;
  }

  start(realm: string): void {
    this.socket = new WebSocket(realm);
    this.socket.onopen = () => this.onConnectFn && this.onConnectFn();
    this.socket.onmessage = ({ data }) => {
      this.onReceivedFn && this.onReceivedFn(data);
    };
    this.socket.onerror = (error) => this.onErrorFn && this.onErrorFn(error);
    this.socket.onclose = () => this.onCloseFn && this.onCloseFn();
  }

  stop(): void {
    throw new Error("Method not implemented.");
  }

  send(message: any): void {
    if (this.socket) {
      if (this.socket.readyState !== this.socket.OPEN) {
        console.warn(
          `Fail to send message as WS is in ${this.socket.readyState} state`
        );
      } else {
        this.socket.send(message);
      }
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

  onClose(callback: () => void): void {
    this.onCloseFn = callback;
  }
}
