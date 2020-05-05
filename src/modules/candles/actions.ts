import { createAction, ActionUnion } from '../redux/utils';

type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '3h' | '6h' | '12h' | '1D' | '7D' | '14D' | '1M';

export enum CANDLES_ACTION_TYPES {
    SUBSCRIBE_TO_CANDLES = 'CANDLES/SUBSCRIBE_TO_CANDLES',
    UNSUBSCRIBE_FROM_CANDLES = 'CANDLES/UNSUBSCRIBE_FROM_CANDLES'
}

export interface SubscribeToCandlesActionPayload {
    symbol: string;
    timeframe: Timeframe;
}

export interface UnsubscribeFromCandlesActionPayload {
    symbol: string;
    timeframe: Timeframe;
}

export const CandlesActions = {
    subscribeToCandles: createAction<CANDLES_ACTION_TYPES.SUBSCRIBE_TO_CANDLES, SubscribeToCandlesActionPayload>(CANDLES_ACTION_TYPES.SUBSCRIBE_TO_CANDLES),
    unsubscribeFromCandles: createAction<CANDLES_ACTION_TYPES.UNSUBSCRIBE_FROM_CANDLES, UnsubscribeFromCandlesActionPayload>(CANDLES_ACTION_TYPES.UNSUBSCRIBE_FROM_CANDLES),
};

export type CandlesActions = ActionUnion<typeof CandlesActions>;
export type SubscribeToCandles = ReturnType<typeof CandlesActions.subscribeToCandles>;
export type UnsubscribeFromCandles = ReturnType<typeof CandlesActions.unsubscribeFromCandles>;
