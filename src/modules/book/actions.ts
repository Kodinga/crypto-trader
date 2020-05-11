import { unsubscribeFromBook } from "./epics";
import { createAction, ActionUnion } from "../redux/utils";

export enum BOOK_ACTION_TYPES {
  SUBSCRIBE_TO_BOOK = "BOOK/SUBSCRIBE_TO_BOOK",
  UNSUBSCRIBE_FROM_BOOK = "BOOK/UNSUBSCRIBE_FROM_BOOK",
}

export interface SubscribeToBookActionPayload {
  symbol: string;
}

export interface UnsubscribeFromBookActionPayload {
  symbol: string;
}

export const BookActions = {
  subscribeToBook: createAction<
    BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK,
    SubscribeToBookActionPayload
  >(BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK),
  unsubscribeFromBook: createAction<
    BOOK_ACTION_TYPES.UNSUBSCRIBE_FROM_BOOK,
    UnsubscribeFromBookActionPayload
  >(BOOK_ACTION_TYPES.UNSUBSCRIBE_FROM_BOOK),
};

export type BookActions = ActionUnion<typeof BookActions>;
export type SubscribeToBook = ReturnType<typeof BookActions.subscribeToBook>;
export type UnsubscribeFromBook = ReturnType<
  typeof BookActions.unsubscribeFromBook
>;
