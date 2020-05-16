import { ConnectionProxy } from "./types/ConnectionProxy";

export class DummyConnectionProxy implements ConnectionProxy {
  start(): void {}

  stop(): void {}

  send(message: any): void {}

  onConnect(callback: () => void): void {}

  onReceived(callback: (data: any) => void): void {}

  onError(callback: (error: any) => void): void {}

  onClose(callback: () => void): void {}
}
