import { createAction, ActionUnion } from '../redux/utils';

export enum TICKER_ACTION_TYPES {
    TICKER_SUBSCRIBE_TO_SYMBOL = 'TICKER_SUBSCRIBE_TO_SYMBOL'
}

export interface SubscribeToSymbolActionPayload {
    symbol: string;
}

export const TickerActions = {
    subscribeToSymbol: createAction<TICKER_ACTION_TYPES.TICKER_SUBSCRIBE_TO_SYMBOL, SubscribeToSymbolActionPayload>(TICKER_ACTION_TYPES.TICKER_SUBSCRIBE_TO_SYMBOL)
};

export type TickerActions = ActionUnion<typeof TickerActions>;
export type SubscribeToTickerSymbolAction = ReturnType<typeof TickerActions.subscribeToSymbol>;

