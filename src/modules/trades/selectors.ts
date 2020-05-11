import { createSelector } from "reselect";
import { memoize } from "lodash";
import { RootState } from "modules/root";

const tradesSelector = (state: RootState) => state.trades;

export const getTrades = createSelector(tradesSelector, (trades) =>
  memoize((symbol: string) => trades[symbol])
);
