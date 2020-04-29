import { createAction, ActionUnion } from 'modules/redux/utils';

export enum WS_ACTION_TYPES {
    WS_SEND = 'WS_SEND',
    WS_MESSAGE = 'WS_MESSAGE',
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
    wsMessage: createAction<WS_ACTION_TYPES.WS_MESSAGE, any, WsMessageActionMeta>(WS_ACTION_TYPES.WS_MESSAGE),
    subscribeToChannelAck: createAction<WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK, SubscribeToChannelAckActionPayload>(WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK),
    subscribeToChannelNack: createAction<WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK, SubscribeToChannelNackActionPayload>(WS_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_NACK)
};

export type WsActions = ActionUnion<typeof WsActions>;
export type WsMessageAction = ReturnType<typeof WsActions.wsMessage>;
export type WsSendAction = ReturnType<typeof WsActions.wsSend>;
export type WsSubscribeToChannelAck = ReturnType<typeof WsActions.subscribeToChannelAck>;
export type WsSubscribeToChannelNack = ReturnType<typeof WsActions.subscribeToChannelNack>;