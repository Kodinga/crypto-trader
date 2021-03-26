import { ConnectionProxy } from "./types/ConnectionProxy";

export class Connection {
  constructor(private connectionProxy: ConnectionProxy) {}

  connect(realm: string) {
    this.connectionProxy.start(realm);
  }

  disconnect() {
    this.connectionProxy.stop();
  }

  send(message: any): void {
    this.connectionProxy.send(message);
  }

  onConnect(callback: () => void) {
    this.connectionProxy.onConnect(callback);
  }

  onReceive(callback: (data: any) => void) {
    this.connectionProxy.onReceived(callback);
  }

  onError(callback: (data: any) => void) {
    this.connectionProxy.onError(callback);
  }

  onClose(callback: () => void) {
    this.connectionProxy.onClose(callback);
  }
}
