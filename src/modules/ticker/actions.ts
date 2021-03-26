import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export interface SubscribeToTickerActionPayload {
  symbol: string;
}

export const TickerActions = {
  subscribeToTicker: action(
    "TICKER/SUBSCRIBE_TO_TICKER",
    (payload: { symbol: string }) => ({ payload })
  ),
};

export type TickerActions = ActionUnion<typeof TickerActions>;
export type SubscribeToTicker = ReturnType<
  typeof TickerActions.subscribeToTicker
>;
