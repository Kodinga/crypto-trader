import { createAction, ActionUnion } from '../redux/utils';

export enum TICKER_ACTION_TYPES {
    SUBSCRIBE_TO_TICKER = 'TICKER/SUBSCRIBE_TO_TICKER'
}

export interface SubscribeToTickerActionPayload {
    symbol: string;
}

export const TickerActions = {
    subscribeToTicker: createAction<TICKER_ACTION_TYPES.SUBSCRIBE_TO_TICKER, SubscribeToTickerActionPayload>(TICKER_ACTION_TYPES.SUBSCRIBE_TO_TICKER)
};

export type TickerActions = ActionUnion<typeof TickerActions>;
export type SubscribeToTickerAction = ReturnType<typeof TickerActions.subscribeToTicker>;

