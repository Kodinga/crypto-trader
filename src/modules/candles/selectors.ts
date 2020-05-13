import { createSelector } from "reselect";
import { memoize } from "lodash";
import { RootState } from "modules/root";
import { getLookupKey } from "./utils";
import { Candle } from "./types/Candle";

const DEFAULT_CANDLES: Candle[] = [];

export const candlesSelector = (state: RootState) => state.candles;

export const getCandles = createSelector(candlesSelector, (candles) =>
  memoize(
    (currencyPair: string, timeframe: string) =>
      candles[getLookupKey(currencyPair, timeframe)] || DEFAULT_CANDLES,
    (currencyPair, timeframe) => `${currencyPair}:${timeframe}`
  )
);
