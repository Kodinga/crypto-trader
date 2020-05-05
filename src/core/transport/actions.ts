import { createAction, ActionUnion } from 'modules/redux/utils';
import { ConnectionStatus } from './types/ConnectionStatus';
import { TradesChannel, CandlesChannel, TickerChannel, BookChannel } from './types/Channels';

export enum TRANSPORT_ACTION_TYPES {
    SEND_MESSAGE = 'TRANSPORT/SEND_MESSAGE',
    RECEIVE_MESSAGE = 'TRANSPORT/RECEIVE_MESSAGE',
    CHANGE_CONNECTION_STATUS = 'TRANSPORT/CHANGE_CONNECTION_STATUS',
    SUBSCRIBE_TO_CHANNEL = 'TRANSPORT/SUBSCRIBE_TO_CHANNEL',
    SUBSCRIBE_TO_CHANNEL_ACK = 'TRANSPORT/SUBSCRIBE_TO_CHANNEL_ACK',
    SUBSCRIBE_TO_CHANNEL_NACK = 'TRANSPORT/SUBSCRIBE_TO_CHANNEL_NACK',
    UNSUBSCRIBE_FROM_CHANNEL= 'TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL',
    UNSUBSCRIBE_FROM_CHANNEL_ACK = 'TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL_ACK',
    UNSUBSCRIBE_FROM_CHANNEL_NACK = 'TRANSPORT/UNSUBSCRIBE_FROM_CHANNEL_NACK'
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

export interface ReceiveMessageActionMeta {
    channel: string;
    request?: any;
}

export interface UnsubscribeFromChannelActionPayload {
    channelId: number;
}

export interface UnsubscribeFromChannelAckActionPayload {
    channelId: number;
}

export const TransportActions = {
    sendMessage: createAction<TRANSPORT_ACTION_TYPES.SEND_MESSAGE, any>(TRANSPORT_ACTION_TYPES.SEND_MESSAGE),
    receiveMessage: createAction<TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE, any, ReceiveMessageActionMeta | undefined>(TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE),
    changeConnectionStatus: createAction<TRANSPORT_ACTION_TYPES.CHANGE_CONNECTION_STATUS, ConnectionStatus>(TRANSPORT_ACTION_TYPES.CHANGE_CONNECTION_STATUS),
    subscribeToChannel: createAction<TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL, SubscribeToChannelActionPayload>(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL),
    subscribeToChannelAck: createAction<TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK, SubscribeToChannelAckActionPayload>(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK),
    subscribeToChannelNack: createAction<TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK, SubscribeToChannelNackActionPayload>(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK),
    unsubscribeFromChannel: createAction<TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL, UnsubscribeFromChannelActionPayload>(TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL),
    unsubscribeFromChannelAck: createAction<TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_ACK, UnsubscribeFromChannelAckActionPayload>(TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_ACK),
    unsubscribeFromChannelNack: createAction<TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_NACK>(TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_NACK),
};

export type TransportActions = ActionUnion<typeof TransportActions>;
export type ReceiveMessage = ReturnType<typeof TransportActions.receiveMessage>;
export type SendMessage = ReturnType<typeof TransportActions.sendMessage>;
export type ChangeConnectionStatus = ReturnType<typeof TransportActions.changeConnectionStatus>;
export type SubscribeToChannel = ReturnType<typeof TransportActions.subscribeToChannel>;
export type SubscribeToChannelAck = ReturnType<typeof TransportActions.subscribeToChannelAck>;
export type SubscribeToChannelNack = ReturnType<typeof TransportActions.subscribeToChannelNack>;
export type UnsubscribeFromChannel = ReturnType<typeof TransportActions.unsubscribeFromChannel>;
export type UnsubscribeFromChannelAck = ReturnType<typeof TransportActions.unsubscribeFromChannelAck>;
export type UnsubscribeFromChannelNack = ReturnType<typeof TransportActions.unsubscribeFromChannelNack>;