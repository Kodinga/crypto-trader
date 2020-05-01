import { ConnectionStatus } from './types/ConnectionStatus';
import { createAction, ActionUnion } from 'modules/redux/utils';

export enum WS_ACTION_TYPES {
    WS_SEND = 'WS_SEND',
    WS_MESSAGE = 'WS_MESSAGE',
    WS_CONNECTION_STATUS_CHANGED = 'WS_CONNECTION_STATUS_CHANGED',
    SUBSCRIBE_TO_CHANNEL_ACK = 'SUBSCRIBE_TO_CHANNEL_ACK',
    SUBSCRIBE_TO_CHANNEL_NACK = 'SUBSCRIBE_TO_CHANNEL_NACK'
}

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
    subscribeToChannelAck: createAction<WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK, SubscribeToChannelAckActionPayload>(WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK),
    subscribeToChannelNack: createAction<WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK, SubscribeToChannelNackActionPayload>(WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK)
};

export type WsActions = ActionUnion<typeof WsActions>;
export type WsMessage = ReturnType<typeof WsActions.wsMessage>;
export type WsSend = ReturnType<typeof WsActions.wsSend>;
export type WsConnectionStatusChanged = ReturnType<typeof WsActions.wsConnectionStatusChanged>;
export type WsSubscribeToChannelAck = ReturnType<typeof WsActions.subscribeToChannelAck>;
export type WsSubscribeToChannelNack = ReturnType<typeof WsActions.subscribeToChannelNack>;