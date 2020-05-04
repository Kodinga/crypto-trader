import { createAction, ActionUnion } from '../redux/utils';

export enum BOOK_ACTION_TYPES {
    BOOK_SUBSCRIBE_TO_SYMBOL = 'BOOK_SUBSCRIBE_TO_SYMBOL'
}

export interface SubscribeToSymbolActionPayload {
    symbol: string;
}

export const BookActions = {
    subscribeToSymbol: createAction<BOOK_ACTION_TYPES.BOOK_SUBSCRIBE_TO_SYMBOL, SubscribeToSymbolActionPayload>(BOOK_ACTION_TYPES.BOOK_SUBSCRIBE_TO_SYMBOL)
};

export type BookActions = ActionUnion<typeof BookActions>;
export type BookSubscribeToSymbol = ReturnType<typeof BookActions.subscribeToSymbol>;

