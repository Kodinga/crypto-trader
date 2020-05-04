import { createAction, ActionUnion } from '../redux/utils';

export enum TRADES_ACTION_TYPES {
    SUBSCRIBE_TO_TRADES = 'TRADES/SUBSCRIBE_TO_SYMBOL'
}

export interface SubscribeToTradesActionPayload {
    symbol: string;
}

export const TradesActions = {
    subscribeToTrades: createAction<TRADES_ACTION_TYPES.SUBSCRIBE_TO_TRADES, SubscribeToTradesActionPayload>(TRADES_ACTION_TYPES.SUBSCRIBE_TO_TRADES)
};

export type TradesActions = ActionUnion<typeof TradesActions>;
export type SubscribeToTrades = ReturnType<typeof TradesActions.subscribeToTrades>;

