import { createSelector } from "reselect";
import { memoize, range } from "lodash";
import { RootState } from "modules/root";
import { getCurrencyPairs } from "modules/reference-data/selectors";
import { candlesSelector } from "modules/candles/selectors";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import { getSubscriptionId, getSubscriptions } from "core/transport/selectors";
import { getValueAt } from "core/utils";
import { getLookupKey } from "./../candles/utils";

const tickerSelector = (state: RootState) => state.ticker;

export const getTicker = createSelector(tickerSelector, (ticker) =>
  memoize((symbol: string) => ticker[symbol])
);

export const getTickers = createSelector(
  getCurrencyPairs,
  tickerSelector,
  (currencyPairs, ticker) =>
    currencyPairs.map((currencyPair) => ({
      currencyPair,
      ...ticker[currencyPair],
    }))
);

export const getVisibleCurrencyPairTickers = createSelector(
  getCurrencyPairs,
  getSelectedCurrencyPair,
  (allCurrencyPairs, selectedCurrencyPair) => {
    let currencyPairs: string[] = [];

    const selectedCurrencyPairIndex = allCurrencyPairs.indexOf(
      selectedCurrencyPair || ""
    );

    // Pick a few currency pairs on each side of the selected one
    if (selectedCurrencyPairIndex >= 0) {
      currencyPairs = range(
        selectedCurrencyPairIndex - 2,
        selectedCurrencyPairIndex + 3
      ).map((index) => getValueAt(allCurrencyPairs)(index));
    }

    return {
      currencyPairs,
      selectedCurrencyPairIndex,
    };
  }
);

export const getTickersWithPrices = createSelector(
  getTickers,
  candlesSelector,
  getSubscriptionId,
  getSubscriptions,
  (tickers, candles, subscribeIdGetter, subscriptions) => {
    return tickers.map((ticker) => {
      const subscriptionId = subscribeIdGetter("ticker", {
        symbol: `t${ticker.currencyPair}`,
      });

      return {
        ...ticker,
        prices: (candles[getLookupKey(ticker.currencyPair, "5m")] || []).map(
          (ticker) => ticker.close
        ),
        isStale: Boolean(
          subscriptionId ? subscriptions[subscriptionId].isStale : false
        ),
      };
    });
  }
);
