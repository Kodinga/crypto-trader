import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export const TradesActions = {
  subscribeToTrades: action(
    "TRADES/SUBSCRIBE_TO_TRADES",
    (payload: { symbol: string }) => ({ payload })
  ),
  unsubscribeFromTrades: action(
    "TRADES/UNSUBSCRIBE_FROM_TRADES",
    (payload: { symbol: string }) => ({ payload })
  ),
};

export type TradesActions = ActionUnion<typeof TradesActions>;
export type SubscribeToTrades = ReturnType<
  typeof TradesActions.subscribeToTrades
>;
export type UnsubscribeFromTrades = ReturnType<
  typeof TradesActions.unsubscribeFromTrades
>;
