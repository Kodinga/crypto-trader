import { action } from "ts-action";
import { ActionUnion } from "modules/redux/utils";
import { ConnectionStatus } from "./types/ConnectionStatus";
import {
  TradesChannel,
  CandlesChannel,
  TickerChannel,
  BookChannel,
} from "./types/Channels";

interface SubscribeToTrades {
  channel: TradesChannel;
  symbol: string;
}

interface SubscribeToCandles {
  channel: CandlesChannel;
  key: string;
}

interface SubscribeToTicker {
  channel: TickerChannel;
  symbol: string;
}

interface SubscribeToBook {
  channel: BookChannel;
  symbol: string;
  prec?: string;
}

export interface InitActionPayload {
  wsEndpoint: string;
}

export type SubscribeToChannelActionPayload =
  | SubscribeToTrades
  | SubscribeToCandles
  | SubscribeToTicker
  | SubscribeToBook;

export const TransportActions = {
  init: action("TRANSPORT/INIT", (payload: { wsEndpoint: string }) => ({
    payload,
  })),
  sendMessage: action("TRANSPORT/SEND_MESSAGE", (payload: any) => ({
    payload,
  })),
  receiveMessage: action(
    "TRANSPORT/RECEIVE_MESSAGE",
    (payload: any, meta: any) => ({
      payload,
      meta,
    })
  ),
  changeConnectionStatus: action(
    "TRANSPORT/CHANGE_CONNECTION_STATUS",
    (payload: ConnectionStatus) => ({
      payload,
    })
  ),
  subscribeToChannel: action(
    "TRANSPORT/SUBSCRIBE_TO_CHANNEL",
    (payload: SubscribeToChannelActionPayload) => ({
      payload,
    })
  ),
  subscribeToChannelAck: action(
    "TRANSPORT/SUBSCRIBE_TO_CHANNEL_ACK",
    (payload: { channel: string; channelId: number; request: any }) => ({
      payload,
    })
  ),
  subscribeToChannelNack: action(
    "TRANSPORT/SUBSCRIBE_TO_CHANNEL_NACK",
    (payload: { error: string }) => ({
      payload,
    })
  ),
  unsubscribeFromChannel: action(
    "TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL",
    (payload: { channelId: number }) => ({
      payload,
    })
  ),
  unsubscribeFromChannelAck: action(
    "TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL_ACK",
    (payload: { channelId: number }) => ({
      payload,
    })
  ),
  unsubscribeFromChannelNack: action(
    "TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL_NACK",
    (payload?: { channelId?: number }) => ({
      payload,
    })
  ),

  staleSubscription: action(
    "TRANSPORT/STALE_SUBSCRIPTION",
    (payload: { channelId: number }) => ({
      payload,
    })
  ),
};

export type TransportActions = ActionUnion<typeof TransportActions>;
export type Init = ReturnType<typeof TransportActions.init>;
export type ReceiveMessage = ReturnType<typeof TransportActions.receiveMessage>;
export type SendMessage = ReturnType<typeof TransportActions.sendMessage>;
export type ChangeConnectionStatus = ReturnType<
  typeof TransportActions.changeConnectionStatus
>;
export type SubscribeToChannel = ReturnType<
  typeof TransportActions.subscribeToChannel
>;
export type SubscribeToChannelAck = ReturnType<
  typeof TransportActions.subscribeToChannelAck
>;
export type SubscribeToChannelNack = ReturnType<
  typeof TransportActions.subscribeToChannelNack
>;
export type UnsubscribeFromChannel = ReturnType<
  typeof TransportActions.unsubscribeFromChannel
>;
export type UnsubscribeFromChannelAck = ReturnType<
  typeof TransportActions.unsubscribeFromChannelAck
>;
export type UnsubscribeFromChannelNack = ReturnType<
  typeof TransportActions.unsubscribeFromChannelNack
>;
export type StaleSubscription = ReturnType<
  typeof TransportActions.staleSubscription
>;
