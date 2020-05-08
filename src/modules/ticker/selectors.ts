import { createSelector } from 'reselect';
import { memoize } from 'lodash';
import { RootState } from 'modules/root';
import { getCurrencyPairs } from 'modules/reference-data/selectors';

const tickerSelector = (state: RootState) => state.ticker;

export const getTicker = createSelector(
    tickerSelector,
    ticker => memoize(
        (symbol: string) => ticker[symbol]
    )
);

export const getTickers = createSelector(
    getCurrencyPairs,
    tickerSelector,
    (currencyPairs, ticker) => currencyPairs.map(currencyPair => ({
        currencyPair,
        ...ticker[currencyPair]
    }))
);

