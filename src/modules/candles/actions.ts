import { createAction, ActionUnion } from '../redux/utils';

export enum CANDLES_ACTION_TYPES {
    SUBSCRIBE_TO_CANDLES = 'CANDLES/SUBSCRIBE_TO_CANDLES'
}

export interface SubscribeToCandlesActionPayload {
    symbol: string;
    timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '3h' | '6h' | '12h' | '1D' | '7D' | '14D' | '1M'
}

export const CandlesActions = {
    subscribeToCandles: createAction<CANDLES_ACTION_TYPES.SUBSCRIBE_TO_CANDLES, SubscribeToCandlesActionPayload>(CANDLES_ACTION_TYPES.SUBSCRIBE_TO_CANDLES)
};

export type CandlesActions = ActionUnion<typeof CandlesActions>;
export type SubscribeToCandles = ReturnType<typeof CandlesActions.subscribeToCandles>;

