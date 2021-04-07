import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export const BookActions = {
  subscribeToBook: action(
    "BOOK/SUBSCRIBE_TO_BOOK",
    (payload: { symbol: string }) => ({ payload })
  ),
  unsubscribeFromBook: action(
    "BOOK/UNSUBSCRIBE_FROM_BOOK",
    (payload: { symbol: string }) => ({ payload })
  ),
};

export type AllBookActions = ActionUnion<typeof BookActions>;
export type SubscribeToBook = ReturnType<typeof BookActions.subscribeToBook>;
export type UnsubscribeFromBook = ReturnType<
  typeof BookActions.unsubscribeFromBook
>;
