import { createSelector } from 'reselect';
import { memoize } from 'lodash';
import { RootState } from 'modules/root';

const tickerSelector = (state: RootState) => state.ticker;

export const getTicker = createSelector(
    tickerSelector,
    ticker => memoize(
        (symbol: string) => ticker[symbol]
    )
)
