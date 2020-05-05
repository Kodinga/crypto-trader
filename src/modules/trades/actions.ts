import { createAction, ActionUnion } from '../redux/utils';

export enum TRADES_ACTION_TYPES {
    SUBSCRIBE_TO_TRADES = 'TRADES/SUBSCRIBE_TO_TRADES',
    UNSUBSCRIBE_FROM_TRADES = 'TRADES/UNSUBSCRIBE_FROM_TRADES'
}

export interface SubscribeToTradesActionPayload {
    symbol: string;
}

export interface UnsubscribeFromTradesActionPayload {
    symbol: string;
}

export const TradesActions = {
    subscribeToTrades: createAction<TRADES_ACTION_TYPES.SUBSCRIBE_TO_TRADES, SubscribeToTradesActionPayload>(TRADES_ACTION_TYPES.SUBSCRIBE_TO_TRADES),
    unsubscribeFromTrades: createAction<TRADES_ACTION_TYPES.UNSUBSCRIBE_FROM_TRADES, UnsubscribeFromTradesActionPayload>(TRADES_ACTION_TYPES.UNSUBSCRIBE_FROM_TRADES)
};

export type TradesActions = ActionUnion<typeof TradesActions>;
export type SubscribeToTrades = ReturnType<typeof TradesActions.subscribeToTrades>;
export type UnsubscribeFromTrades = ReturnType<typeof TradesActions.unsubscribeFromTrades>;
