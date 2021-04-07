import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

type Timeframe =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "3h"
  | "6h"
  | "12h"
  | "1D"
  | "7D"
  | "14D"
  | "1M";

export const CandlesActions = {
  subscribeToCandles: action(
    "CANDLES/SUBSCRIBE_TO_CANDLES",
    (payload: { symbol: string; timeframe: Timeframe }) => ({ payload })
  ),
  unsubscribeFromCandles: action(
    "CANDLES/UNSUBSCRIBE_FROM_CANDLES",
    (payload: { symbol: string; timeframe: Timeframe }) => ({ payload })
  ),
};

export type AllCandlesActions = ActionUnion<typeof CandlesActions>;
export type SubscribeToCandles = ReturnType<
  typeof CandlesActions.subscribeToCandles
>;
export type UnsubscribeFromCandles = ReturnType<
  typeof CandlesActions.unsubscribeFromCandles
>;
