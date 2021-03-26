export interface ConnectionProxyConstructor {
  new (realm: string): ConnectionProxy;
}

export interface ConnectionProxy {
  start(realm: string): void;
  stop(): void;
  send(message: any): void;
  onConnect(callback: () => void): void;
  onReceived(callback: (data: any) => void): void;
  onError(callback: (error: any) => void): void;
  onClose(callback: () => void): void;
}
