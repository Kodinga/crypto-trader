import { ConnectionStatus } from './types/ConnectionStatus';
import { createAction, ActionUnion } from 'modules/redux/utils';
import { TradesChannel, CandlesChannel, TickerChannel, BookChannel } from './types/Channels';

export enum WS_ACTION_TYPES {
    WS_SEND = 'WS_SEND',
    WS_MESSAGE = 'WS_MESSAGE',
    WS_CONNECTION_STATUS_CHANGED = 'WS_CONNECTION_STATUS_CHANGED',
    WS_SUBSCRIBE_TO_CHANNEL = 'WS_SUBSCRIBE_TO_CHANNEL',
    WS_SUBSCRIBE_TO_CHANNEL_ACK = 'WS_SUBSCRIBE_TO_CHANNEL_ACK',
    WS_SUBSCRIBE_TO_CHANNEL_NACK = 'WS_SUBSCRIBE_TO_CHANNEL_NACK'
}

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

export type SubscribeToChannelActionPayload = SubscribeToTrades | SubscribeToCandles | SubscribeToTicker | SubscribeToBook;

export interface SubscribeToChannelAckActionPayload {
    channel: string;
    channelId: number;
    request: any;
}

export interface SubscribeToChannelNackActionPayload {
    error: string;
}

export interface WsMessageActionMeta {
    channel: string;
    request?: any;
}

export const WsActions = {
    wsSend: createAction<WS_ACTION_TYPES.WS_SEND, any>(WS_ACTION_TYPES.WS_SEND),
    wsMessage: createAction<WS_ACTION_TYPES.WS_MESSAGE, any, WsMessageActionMeta | undefined>(WS_ACTION_TYPES.WS_MESSAGE),
    wsConnectionStatusChanged: createAction<WS_ACTION_TYPES.WS_CONNECTION_STATUS_CHANGED, ConnectionStatus>(WS_ACTION_TYPES.WS_CONNECTION_STATUS_CHANGED),
    subscribeToChannel: createAction<WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL, SubscribeToChannelActionPayload>(WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL),
    subscribeToChannelAck: createAction<WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL_ACK, SubscribeToChannelAckActionPayload>(WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL_ACK),
    subscribeToChannelNack: createAction<WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL_NACK, SubscribeToChannelNackActionPayload>(WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL_NACK)
};

export type WsActions = ActionUnion<typeof WsActions>;
export type WsMessage = ReturnType<typeof WsActions.wsMessage>;
export type WsSend = ReturnType<typeof WsActions.wsSend>;
export type WsConnectionStatusChanged = ReturnType<typeof WsActions.wsConnectionStatusChanged>;
export type WsSubscribeToChannel = ReturnType<typeof WsActions.subscribeToChannel>;
export type WsSubscribeToChannelAck = ReturnType<typeof WsActions.subscribeToChannelAck>;
export type WsSubscribeToChannelNack = ReturnType<typeof WsActions.subscribeToChannelNack>;