export interface ConnectionProxyConstructor {
  new (realm: string): ConnectionProxy;
}

export interface ConnectionProxy {
  start(): void;
  stop(): void;
  send(message: any): void;
  onConnect(callback: () => void): void;
  onReceived(callback: (data: any) => void): void;
  onError(callback: (error: any) => void): void;
}
