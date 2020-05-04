import { createAction, ActionUnion } from '../redux/utils';

export enum BOOK_ACTION_TYPES {
    SUBSCRIBE_TO_BOOK = 'BOOK/SUBSCRIBE_TO_BOOK'
}

export interface SubscribeToBookActionPayload {
    symbol: string;
}

export const BookActions = {
    subscribeToBook: createAction<BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK, SubscribeToBookActionPayload>(BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK)
};

export type BookActions = ActionUnion<typeof BookActions>;
export type SubscribeToBook = ReturnType<typeof BookActions.subscribeToBook>;

