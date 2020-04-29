import { createAction, ActionUnion } from '../redux/utils';

export enum TRADES_ACTION_TYPES {
    SUBSCRIBE_TO_SYMBOL = 'SUBSCRIBE_TO_SYMBOL'
}

export interface SubscribeToSymbolActionPayload {
    symbol: string;
}

export const TradeActions = {
    subscribeToSymbol: createAction<TRADES_ACTION_TYPES.SUBSCRIBE_TO_SYMBOL, SubscribeToSymbolActionPayload>(TRADES_ACTION_TYPES.SUBSCRIBE_TO_SYMBOL)
};

export type TradeActions = ActionUnion<typeof TradeActions>;
export type SubscribeToSymbolAction = ReturnType<typeof TradeActions.subscribeToSymbol>;

