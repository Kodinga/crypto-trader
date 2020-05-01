import { createAction, ActionUnion } from '../redux/utils';

export enum CANDLE_ACTION_TYPES {
    CANDLE_SUBSCRIBE_TO_SYMBOL = 'CANDLE_SUBSCRIBE_TO_SYMBOL'
}

export interface SubscribeToSymbolActionPayload {
    symbol: string;
    timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '3h' | '6h' | '12h' | '1D' | '7D' | '14D' | '1M'
}

export const CandleActions = {
    subscribeToSymbol: createAction<CANDLE_ACTION_TYPES.CANDLE_SUBSCRIBE_TO_SYMBOL, SubscribeToSymbolActionPayload>(CANDLE_ACTION_TYPES.CANDLE_SUBSCRIBE_TO_SYMBOL)
};

export type CandleActions = ActionUnion<typeof CandleActions>;
export type SubscribeToCandlesSymbolAction = ReturnType<typeof CandleActions.subscribeToSymbol>;

